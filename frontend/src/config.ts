const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

export const config = {
  apiUrl: API_URL,
  useMockApi: import.meta.env.VITE_USE_MOCK_API !== 'false',
} as const
