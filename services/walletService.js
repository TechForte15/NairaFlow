const Wallet = require('../models/wallet');
const { generateWalletId } = require('../utils/idGenerator');
const { NotFoundError, ConflictError, ValidationError } = require('../utils/errors');

// matches any-valid-local-part@gmail.com (dots/plus-addressing allowed, case-insensitive)
const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

function assertValidGmail(email) {
  if (!email || typeof email !== 'string') {
    throw new ValidationError('userId (Gmail address) is required');
  }
  if (!GMAIL_REGEX.test(email.trim())) {
    throw new ValidationError('userId must be a valid Gmail address (e.g. name@gmail.com)');
  }
}

async function createWallet({ userId, currency = 'NGN', metadata = {} }) {
  assertValidGmail(userId);
  const email = userId.trim().toLowerCase();

  const existing = await Wallet.findOne({ userId: email, currency: currency.toUpperCase() });
  if (existing) {
    throw new ConflictError(
      `Wallet already exists for ${email} in ${currency.toUpperCase()}`
    );
  }

  const wallet = await Wallet.create({
    walletId: generateWalletId(),
    userId: email,
    currency: currency.toUpperCase(),
    balance: 0,
    metadata,
  });

  return wallet;
}

async function getWalletById(walletId) {
  const wallet = await Wallet.findOne({ walletId });
  if (!wallet) throw new NotFoundError(`Wallet ${walletId} not found`);
  return wallet;
}

async function getWalletByUserId(userId, currency = 'NGN') {
  const wallet = await Wallet.findOne({ userId, currency: currency.toUpperCase() });
  if (!wallet) throw new NotFoundError(`Wallet not found for user ${userId}`);
  return wallet;
}

async function getBalance(walletId) {
  const wallet = await getWalletById(walletId);
  return {
    walletId: wallet.walletId,
    currency: wallet.currency,
    balanceMinorUnits: wallet.balance,
    balance: wallet.balance / 100,
    status: wallet.status,
    updatedAt: wallet.updatedAt,
  };
}

module.exports = { createWallet, getWalletById, getWalletByUserId, getBalance };