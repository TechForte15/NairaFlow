import { config } from '../config'
import { mockAuthService } from './mockAuthService'
import { mockWalletService } from './mockWalletService'
import { mockDashboardService } from './mockDashboardService'
import { authApi } from '../api/auth'
import { walletApi } from '../api/wallet'
import { transfersApi } from '../api/transfers'
import { transactionsApi } from '../api/transactions'
import type { LoginInput, RegisterInput, User } from '../types/auth'
import type { TransferInput } from '../types/transfer'
import type { WalletData, WalletTransaction } from '../types/wallet'
import type { DashboardData, DashboardTransaction } from '../types/dashboard'

// ── Auth service ──────────────────────────────────────────────

type AuthService = {
  register(input: RegisterInput): Promise<User>
  login(input: LoginInput): Promise<User>
  getCurrentUser(): User | null
  logout(): void
}

const mockAuth: AuthService = mockAuthService

const realAuth: AuthService = {
  register: (input) => authApi.register(input),
  login: (input) => authApi.login(input),
  getCurrentUser: () => null, // real auth uses tokens; handled by AuthProvider
  logout: () => {},
}

// ── Wallet service ────────────────────────────────────────────

type WalletService = {
  getWallet(): Promise<WalletData>
  fundWallet(amount: number): Promise<WalletData>
  transfer(input: TransferInput): Promise<WalletData>
}

const mockWallet: WalletService = mockWalletService

const realWallet: WalletService = {
  getWallet: () => walletApi.getWallet(getToken()),
  fundWallet: (amount) => walletApi.fundWallet(amount, getToken()),
  transfer: (input) => transfersApi.sendTransfer(input, getToken()),
}

// ── Dashboard service ─────────────────────────────────────────

type DashboardService = {
  getDashboardData(options?: { includeTransactions?: boolean }): Promise<DashboardData>
}

const mockDashboard: DashboardService = mockDashboardService

function toDashboardTransaction(transaction: WalletTransaction): DashboardTransaction {
  return {
    id: transaction.id,
    description: transaction.description,
    type: transaction.type === 'funding' ? 'wallet-funding' : 'transfer-sent',
    amount: transaction.amount,
    status: transaction.status,
    date: transaction.date,
  }
}

const realDashboard: DashboardService = {
  async getDashboardData(options = {}) {
    const wallet = await realWallet.getWallet()
    const transactions = await transactionsApi.getTransactions(getToken())

    return {
      availableBalance: wallet.availableBalance,
      transactions: options.includeTransactions === false ? [] : transactions.map(toDashboardTransaction),
    }
  },
}

// ── Transactions service ──────────────────────────────────────

type TransactionsService = {
  getTransactions(): Promise<WalletTransaction[]>
  getTransaction(id: string): Promise<WalletTransaction>
}

const mockTransactions: TransactionsService = {
  async getTransactions() {
    const wallet = await mockWalletService.getWallet()
    return wallet.transactions
  },
  async getTransaction(id) {
    const wallet = await mockWalletService.getWallet()
    const transaction = wallet.transactions.find((t) => t.id === id)
    if (!transaction) throw new Error('Transaction not found.')
    return transaction
  },
}

const realTransactions: TransactionsService = {
  getTransactions: () => transactionsApi.getTransactions(getToken()),
  getTransaction: (id) => transactionsApi.getTransaction(id, getToken()),
}

// ── Token helper (for real API) ───────────────────────────────

function getToken(): string {
  const user = mockAuthService.getCurrentUser()
  return user?.id ?? ''
}

// ── Exports ───────────────────────────────────────────────────

export const authService = config.useMockApi ? mockAuth : realAuth
export const walletService = config.useMockApi ? mockWallet : realWallet
export const dashboardService = config.useMockApi ? mockDashboard : realDashboard
export const transactionsService = config.useMockApi ? mockTransactions : realTransactions
