import type { LoginInput, RegisterInput, User } from '../types/auth'

type MockStoredUser = User & {
  password: string
}

const USERS_STORAGE_KEY = 'nairaflow_mock_users'
const CURRENT_USER_STORAGE_KEY = 'nairaflow_mock_current_user'

const wait = () => new Promise((resolve) => window.setTimeout(resolve, 500))

function getStoredUsers(): MockStoredUser[] {
  const savedUsers = localStorage.getItem(USERS_STORAGE_KEY)

  if (!savedUsers) {
    return []
  }

  try {
    return JSON.parse(savedUsers) as MockStoredUser[]
  } catch {
    return []
  }
}

function saveUsers(users: MockStoredUser[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

function toUser({ password: _password, ...user }: MockStoredUser): User {
  return user
}

function normaliseEmail(email: string) {
  return email.trim().toLowerCase()
}

/**
 * Browser-only mock authentication for frontend development.
 * It is not real authentication and must be replaced by API calls before release.
 */
export const mockAuthService = {
  async register(input: RegisterInput): Promise<User> {
    await wait()

    const users = getStoredUsers()
    const email = normaliseEmail(input.email)
    const emailAlreadyExists = users.some((user) => user.email === email)

    if (emailAlreadyExists) {
      throw new Error('An account with this email already exists.')
    }

    const storedUser: MockStoredUser = {
      id: `mock-user-${Date.now()}`,
      fullName: input.fullName.trim(),
      email,
      password: input.password,
    }

    saveUsers([...users, storedUser])

    const user = toUser(storedUser)
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user))

    return user
  },

  async login(input: LoginInput): Promise<User> {
    await wait()

    const email = normaliseEmail(input.email)
    const user = getStoredUsers().find(
      (storedUser) => storedUser.email === email && storedUser.password === input.password,
    )

    if (!user) {
      throw new Error('Invalid email or password.')
    }

    const currentUser = toUser(user)
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser))

    return currentUser
  },

  getCurrentUser(): User | null {
    const savedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY)

    if (!savedUser) {
      return null
    }

    try {
      return JSON.parse(savedUser) as User
    } catch {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
      return null
    }
  },

  logout() {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
  },
}
