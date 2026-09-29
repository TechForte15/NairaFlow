import { createContext, useContext, useState, type ReactNode } from 'react'
import { mockAuthService } from '../services/mockAuthService'
import type { LoginInput, RegisterInput, User } from '../types/auth'

type ProfileInput = {
  firstName: string
  lastName: string
}

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  register: (input: RegisterInput) => Promise<void>
  login: (input: LoginInput) => Promise<void>
  updateProfile: (input: ProfileInput) => Promise<void>
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

  async function updateProfile(input: ProfileInput) {
    const updatedUser = await mockAuthService.updateProfile(input)
    setUser(updatedUser)
  }

  function logout() {
    mockAuthService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: user !== null, register, login, updateProfile, logout }}
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
