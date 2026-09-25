import type { DashboardData } from '../types/dashboard'

type MockDashboardOptions = {
  includeTransactions?: boolean
}

const mockDashboardData: DashboardData = {
  availableBalance: 250000,
  transactions: [
    {
      id: 'mock-transaction-1',
      description: 'Wallet funding',
      type: 'wallet-funding',
      amount: 100000,
      status: 'completed',
      date: '2026-09-20T10:30:00.000Z',
    },
    {
      id: 'mock-transaction-2',
      description: 'Transfer to Chinedu Okafor',
      type: 'transfer-sent',
      amount: 18500,
      status: 'completed',
      date: '2026-09-19T14:15:00.000Z',
    },
    {
      id: 'mock-transaction-3',
      description: 'Transfer from Amina Bello',
      type: 'transfer-received',
      amount: 42500,
      status: 'pending',
      date: '2026-09-18T09:00:00.000Z',
    },
    {
      id: 'mock-transaction-4',
      description: 'Transfer to Kola Adeyemi',
      type: 'transfer-sent',
      amount: 7500,
      status: 'failed',
      date: '2026-09-17T16:45:00.000Z',
    },
  ],
}

const wait = () => new Promise((resolve) => window.setTimeout(resolve, 400))

/**
 * Mock dashboard data for frontend development only.
 * Replace this function with wallet and transaction API calls when they are available.
 */
export const mockDashboardService = {
  async getDashboardData({ includeTransactions = true }: MockDashboardOptions = {}) {
    await wait()

    return {
      ...mockDashboardData,
      transactions: includeTransactions ? mockDashboardData.transactions : [],
    }
  },
}
