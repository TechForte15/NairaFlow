const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema(
  {
    walletId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'NGN',
      uppercase: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'closed'],
      default: 'active',
    },
    version: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

walletSchema.index({ userId: 1, currency: 1 }, { unique: true });

module.exports = mongoose.model('Wallet', walletSchema);