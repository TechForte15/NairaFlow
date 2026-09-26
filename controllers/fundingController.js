const fundingService = require('../services/fundingService');

async function fundWallet(req, res, next) {
  try {
    const { walletId } = req.params;
    const { amount, channel, provider, idempotencyKey, metadata } = req.body;

    const transaction = await fundingService.fundWalletDirect({
      walletId, amount, channel, provider, idempotencyKey, metadata,
    });

    res.status(200).json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
}

async function initiateFunding(req, res, next) {
  try {
    const { walletId } = req.params;
    const { amount, channel, provider, idempotencyKey, metadata } = req.body;

    const transaction = await fundingService.initiateFundingTransaction({
      walletId, amount, channel, provider, idempotencyKey, metadata,
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
}

async function confirmFunding(req, res, next) {
  try {
    const { reference, providerReference } = req.body;
    const transaction = await fundingService.confirmFunding({ reference, providerReference });
    res.status(200).json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
}

async function failFunding(req, res, next) {
  try {
    const { reference, reason } = req.body;
    const transaction = await fundingService.failFunding({ reference, reason });
    res.status(200).json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
}

module.exports = { fundWallet, initiateFunding, confirmFunding, failFunding };