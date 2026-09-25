import { useEffect, useState } from 'react'
import { BalanceCard } from '../components/BalanceCard'
import { QuickActions } from '../components/QuickActions'
import { RecentTransactions } from '../components/RecentTransactions'
import { useAuth } from '../hooks/useAuth'
import { mockDashboardService } from '../services/mockDashboardService'
import type { DashboardData } from '../types/dashboard'

export function DashboardPage() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [error, setError] = useState('')

  async function loadDashboard() {
    setError('')
    setDashboardData(null)

    try {
      const data = await mockDashboardService.getDashboardData()
      setDashboardData(data)
    } catch {
      setError('Unable to load your dashboard. Please try again.')
    }
  }

  useEffect(() => {
    void loadDashboard()
  }, [])

  const firstName = user?.fullName.split(' ')[0] ?? 'there'

  if (error) {
    return (
      <section id="dashboard" className="dashboard-page" aria-labelledby="dashboard-heading">
        <h1 id="dashboard-heading" className="heading-1">
          Welcome back, {firstName}
        </h1>
        <div className="card dashboard-feedback">
          <p className="message message--error" role="alert">
            {error}
          </p>
          <button className="button button--secondary" type="button" onClick={loadDashboard}>
            Try again
          </button>
        </div>
      </section>
    )
  }

  if (!dashboardData) {
    return (
      <section id="dashboard" className="dashboard-page" aria-labelledby="dashboard-heading">
        <h1 id="dashboard-heading" className="heading-1">
          Welcome back, {firstName}
        </h1>
        <p className="dashboard-loading" role="status">
          Loading your dashboard…
        </p>
      </section>
    )
  }

  return (
    <section id="dashboard" className="dashboard-page" aria-labelledby="dashboard-heading">
      <div className="dashboard-header">
        <div>
          <h1 id="dashboard-heading" className="heading-1">
            Welcome back, {firstName}
          </h1>
          <p className="body-text">Here is a quick overview of your wallet activity.</p>
        </div>
      </div>

      <BalanceCard balance={dashboardData.availableBalance} />
      <QuickActions />
      <RecentTransactions transactions={dashboardData.transactions} />
    </section>
  )
}
