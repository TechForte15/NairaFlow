import { apiClient } from './client'
import type { LoginInput, RegisterInput, User } from '../types/auth'

export const authApi = {
  async register(input: RegisterInput): Promise<User> {
    return apiClient.post<User>('/auth/register', input)
  },

  async login(input: LoginInput): Promise<User> {
    return apiClient.post<User>('/auth/login', input)
  },

  async getMe(token: string): Promise<User> {
    return apiClient.get<User>('/users/me', token)
  },
}
