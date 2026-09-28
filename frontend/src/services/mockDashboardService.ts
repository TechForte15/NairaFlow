import type { DashboardData } from '../types/dashboard'
import { mockWalletService } from './mockWalletService'
import type { WalletTransaction } from '../types/wallet'

type MockDashboardOptions = {
  includeTransactions?: boolean
}

const wait = () => new Promise((resolve) => window.setTimeout(resolve, 400))

function toDashboardTransaction(transaction: WalletTransaction) {
  return {
    id: transaction.id,
    description: transaction.description,
    type: transaction.type === 'funding' ? ('wallet-funding' as const) : ('transfer-sent' as const),
    amount: transaction.amount,
    status: transaction.status,
    date: transaction.date,
  }
}

/**
 * Mock dashboard data for frontend development only.
 * This uses the same wallet transaction state as the rest of the app.
 */
export const mockDashboardService = {
  async getDashboardData({ includeTransactions = true }: MockDashboardOptions = {}): Promise<DashboardData> {
    await wait()
    const wallet = await mockWalletService.getWallet()
    const walletTransactions = wallet.transactions.map(toDashboardTransaction)

    return {
      availableBalance: wallet.availableBalance,
      transactions: includeTransactions ? walletTransactions : [],
    }
  },
}
