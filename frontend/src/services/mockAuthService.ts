import type { LoginInput, RegisterInput, User } from '../types/auth'

type MockStoredUser = User & {
  firstName: string
  lastName: string
  password: string
}

const USERS_STORAGE_KEY = 'nairaflow_mock_users'
const CURRENT_USER_STORAGE_KEY = 'nairaflow_mock_current_user'

const wait = () => new Promise((resolve) => window.setTimeout(resolve, 500))

function makeAccountNumber() {
  return String(Math.floor(1000000000 + Math.random() * 9000000000))
}

function generateUniqueAccountNumber(users: MockStoredUser[]) {
  let candidate = makeAccountNumber()

  while (users.some((user) => user.accountNumber === candidate)) {
    candidate = makeAccountNumber()
  }

  return candidate
}

function normaliseAccountNumber(accountNumber?: string) {
  const value = String(accountNumber ?? '').trim()
  return /^\d{6,15}$/.test(value) ? value : ''
}

function ensureAccountNumbers(users: MockStoredUser[]): MockStoredUser[] {
  let updatedUsers = [...users]
  let changed = false

  updatedUsers = updatedUsers.map((user) => {
    const cleanedAccountNumber = normaliseAccountNumber(user.accountNumber)

    if (cleanedAccountNumber) {
      return user
    }

    changed = true
    return {
      ...user,
      accountNumber: generateUniqueAccountNumber(updatedUsers),
    }
  })

  if (changed) {
    saveUsers(updatedUsers)
  }

  return updatedUsers
}

function getStoredUsers(): MockStoredUser[] {
  const savedUsers = localStorage.getItem(USERS_STORAGE_KEY)

  if (!savedUsers) {
    return []
  }

  try {
    const users = JSON.parse(savedUsers) as MockStoredUser[]
    return ensureAccountNumbers(users)
  } catch {
    return []
  }
}

function saveUsers(users: MockStoredUser[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

function splitFullName(fullName: string) {
  const trimmedName = fullName.trim()
  const [firstName, ...remaining] = trimmedName.split(/\s+/)

  return {
    firstName: firstName ?? '',
    lastName: remaining.join(' '),
  }
}

function toUser({ password: _password, firstName: _firstName, lastName: _lastName, ...user }: MockStoredUser): User {
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

    const { firstName, lastName } = splitFullName(input.fullName)
    const fullName = `${firstName} ${lastName}`.trim()

    const storedUser: MockStoredUser = {
      id: `mock-user-${Date.now()}`,
      fullName,
      email,
      accountNumber: generateUniqueAccountNumber(users),
      firstName,
      lastName,
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

  async updateProfile(input: { firstName: string; lastName: string }): Promise<User> {
    const currentUser = mockAuthService.getCurrentUser()

    if (!currentUser) {
      throw new Error('You must be signed in to update your profile.')
    }

    const firstName = input.firstName.trim()
    const lastName = input.lastName.trim()

    if (!firstName || !lastName) {
      throw new Error('First name and last name are required.')
    }

    const fullName = `${firstName} ${lastName}`.trim()

    const users = getStoredUsers().map((storedUser) =>
      storedUser.id === currentUser.id
        ? {
            ...storedUser,
            firstName,
            lastName,
            fullName,
          }
        : storedUser,
    )

    saveUsers(users)

    const updatedUser: User = {
      ...currentUser,
      fullName,
    }

    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(updatedUser))

    return updatedUser
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
