import { createContext, useContext, useState, type ReactNode } from 'react'
import { mockAuthService } from '../services/mockAuthService'
import type { LoginInput, RegisterInput, User } from '../types/auth'

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  register: (input: RegisterInput) => Promise<void>
  login: (input: LoginInput) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => mockAuthService.getCurrentUser())

  async function register(input: RegisterInput) {
    const registeredUser = await mockAuthService.register(input)
    setUser(registeredUser)
  }

  async function login(input: LoginInput) {
    const loggedInUser = await mockAuthService.login(input)
    setUser(loggedInUser)
  }

  function logout() {
    mockAuthService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: user !== null, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return auth
}
