import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { AppLayout } from './layouts/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

type AuthScreen = 'login' | 'register'

export function App() {
  const { isAuthenticated, logout } = useAuth()
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login')

  if (isAuthenticated) {
    return (
      <AppLayout onLogout={logout}>
        <DashboardPage />
      </AppLayout>
    )
  }

  if (authScreen === 'register') {
    return <RegisterPage onShowLogin={() => setAuthScreen('login')} />
  }

  return <LoginPage onShowRegister={() => setAuthScreen('register')} />
}
