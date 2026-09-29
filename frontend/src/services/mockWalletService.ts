import type { WalletData, WalletTransaction } from '../types/wallet'
import type { TransferInput } from '../types/transfer'

let mockWallet: WalletData = {
  availableBalance: 250000,
  transactions: [],
}

const wait = () => new Promise((resolve) => window.setTimeout(resolve, 500))

function copyWallet(): WalletData {
  return {
    ...mockWallet,
    transactions: [...mockWallet.transactions],
  }
}

/**
 * Browser-only wallet data for frontend development.
 * It simulates wallet funding and transfers only and must be replaced by API calls later.
 */
export const mockWalletService = {
  async getWallet(): Promise<WalletData> {
    await wait()
    return copyWallet()
  },

  async fundWallet(amount: number): Promise<WalletData> {
    await wait()

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Enter a funding amount greater than ₦0.')
    }

    const timestamp = Date.now()
    const transaction: WalletTransaction = {
      id: `mock-funding-${timestamp}`,
      type: 'funding',
      direction: 'incoming',
      amount,
      date: new Date().toISOString(),
      status: 'completed',
      description: 'Simulated wallet funding',
      reference: `FUND-${String(timestamp).slice(-6)}`,
    }

    mockWallet = {
      availableBalance: mockWallet.availableBalance + amount,
      transactions: [transaction, ...mockWallet.transactions],
    }

    return copyWallet()
  },

  async transfer(input: TransferInput): Promise<WalletData> {
    await wait()

    const recipient = input.recipient.trim()

    if (!recipient) {
      throw new Error('Enter the recipient wallet or account.')
    }

    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      throw new Error('Enter a transfer amount greater than ₦0.')
    }

    if (input.amount > mockWallet.availableBalance) {
      throw new Error('This amount is more than your available balance.')
    }

    const timestamp = Date.now()
    const transaction: WalletTransaction = {
      id: `mock-transfer-${timestamp}`,
      type: 'transfer',
      direction: 'outgoing',
      amount: input.amount,
      date: new Date().toISOString(),
      status: 'completed',
      description: input.description?.trim() || `Transfer to ${recipient}`,
      reference: `TRF-${String(timestamp).slice(-6)}`,
      recipient,
    }

    mockWallet = {
      availableBalance: mockWallet.availableBalance - input.amount,
      transactions: [transaction, ...mockWallet.transactions],
    }

    return copyWallet()
  },
}
