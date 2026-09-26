const express = require('express');
const walletController = require('../controllers/walletController');
const fundingController = require('../controllers/fundingController');

const router = express.Router();

router.post('/wallets', walletController.createWallet);
router.get('/wallets/:walletId', walletController.getWallet);
router.get('/users/:userId/wallet', walletController.getWalletByUser);
router.get('/wallets/:walletId/balance', walletController.getBalance);
router.post('/wallets/:walletId/fund', fundingController.fundWallet);
router.post('/wallets/:walletId/fund/initiate', fundingController.initiateFunding);
router.post('/wallets/fund/confirm', fundingController.confirmFunding);
router.post('/wallets/fund/fail', fundingController.failFunding);

module.exports = router;