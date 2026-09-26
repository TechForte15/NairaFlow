const mongoose = require('mongoose');
const Wallet = require('../models/wallet');
const Transaction = require('../models/Transaction');
const { generateTransactionReference } = require('../utils/idGenerator');
const { NotFoundError, ValidationError, ConflictError } = require('../utils/errors');

const MIN_FUNDING_AMOUNT = 100;
const MAX_FUNDING_AMOUNT = 500_000_00;

function validateFundingInput({ walletId, amount, idempotencyKey }) {
  if (!walletId) throw new ValidationError('walletId is required');
  if (!idempotencyKey) throw new ValidationError('idempotencyKey is required');
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new ValidationError('amount must be a positive integer (minor units)');
  }
  if (amount < MIN_FUNDING_AMOUNT) {
    throw new ValidationError(`amount must be at least ${MIN_FUNDING_AMOUNT} minor units`);
  }
  if (amount > MAX_FUNDING_AMOUNT) {
    throw new ValidationError(`amount exceeds maximum allowed funding limit`);
  }
}

async function initiateFundingTransaction({
  walletId,
  amount,
  channel = 'wallet_topup',
  provider = 'internal',
  idempotencyKey,
  metadata = {},
}) {
  validateFundingInput({ walletId, amount, idempotencyKey });

  const existing = await Transaction.findOne({ idempotencyKey });
  if (existing) return existing;

  const wallet = await Wallet.findOne({ walletId });
  if (!wallet) throw new NotFoundError(`Wallet ${walletId} not found`);
  if (wallet.status !== 'active') {
    throw new ConflictError(`Wallet ${walletId} is not active (status: ${wallet.status})`);
  }

  const transaction = await Transaction.create({
    reference: generateTransactionReference(),
    walletId: wallet.walletId,
    userId: wallet.userId,
    type: 'funding',
    channel,
    amount,
    currency: wallet.currency,
    status: 'pending',
    idempotencyKey,
    provider,
    metadata,
  });

  return transaction;
}

async function confirmFunding({ reference, providerReference }) {
  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const transaction = await Transaction.findOne({ reference }).session(session);
      if (!transaction) throw new NotFoundError(`Transaction ${reference} not found`);

      if (transaction.status === 'success') {
        result = transaction;
        return;
      }
      if (transaction.status !== 'pending') {
        throw new ConflictError(
          `Transaction ${reference} cannot be confirmed from status ${transaction.status}`
        );
      }

      const wallet = await Wallet.findOne({ walletId: transaction.walletId }).session(session);
      if (!wallet) throw new NotFoundError(`Wallet ${transaction.walletId} not found`);

      const balanceBefore = wallet.balance;
      const balanceAfter = balanceBefore + transaction.amount;

      wallet.balance = balanceAfter;
      wallet.version += 1;
      await wallet.save({ session });

      transaction.status = 'success';
      transaction.balanceBefore = balanceBefore;
      transaction.balanceAfter = balanceAfter;
      if (providerReference) transaction.providerReference = providerReference;
      await transaction.save({ session });

      result = transaction;
    });

    return result;
  } finally {
    session.endSession();
  }
}

async function failFunding({ reference, reason }) {
  const transaction = await Transaction.findOne({ reference });
  if (!transaction) throw new NotFoundError(`Transaction ${reference} not found`);
  if (transaction.status !== 'pending') {
    throw new ConflictError(
      `Transaction ${reference} cannot be failed from status ${transaction.status}`
    );
  }

  transaction.status = 'failed';
  transaction.failureReason = reason || 'Unspecified failure';
  await transaction.save();

  return transaction;
}

async function fundWalletDirect(input) {
  const transaction = await initiateFundingTransaction(input);
  if (transaction.status === 'success') return transaction;
  return confirmFunding({ reference: transaction.reference });
}

module.exports = { initiateFundingTransaction, confirmFunding, failFunding, fundWalletDirect };