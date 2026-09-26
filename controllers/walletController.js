const walletService = require('../services/walletService');

async function createWallet(req, res, next) {
  try {
    const { userId, currency, metadata } = req.body;
    const wallet = await walletService.createWallet({ userId, currency, metadata });
    res.status(201).json({ success: true, data: wallet });
  } catch (err) {
    next(err);
  }
}

async function getWallet(req, res, next) {
  try {
    const { walletId } = req.params;
    const wallet = await walletService.getWalletById(walletId);
    res.status(200).json({ success: true, data: wallet });
  } catch (err) {
    next(err);
  }
}

async function getWalletByUser(req, res, next) {
  try {
    const { userId } = req.params;
    const { currency } = req.query;
    const wallet = await walletService.getWalletByUserId(userId, currency);
    res.status(200).json({ success: true, data: wallet });
  } catch (err) {
    next(err);
  }
}

async function getBalance(req, res, next) {
  try {
    const { walletId } = req.params;
    const balance = await walletService.getBalance(walletId);
    res.status(200).json({ success: true, data: balance });
  } catch (err) {
    next(err);
  }
}

module.exports = { createWallet, getWallet, getWalletByUser, getBalance };