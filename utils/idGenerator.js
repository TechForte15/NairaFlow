const crypto = require('crypto');

function generateWalletId() {
  return `WAL-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
}

function generateTransactionReference() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(5).toString('hex').toUpperCase();
  return `TXN-${timestamp}-${random}`;
}

module.exports = { generateWalletId, generateTransactionReference };