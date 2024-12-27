import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  _id: string
  username: string
  email: string
  profilePicture?: string
  bio?: string
  startup?: string
  position?: string
}

interface AuthStore {
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  updateUser: (updates: Partial<User>) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      user: null,
      token: null,
      setUser: user => set({ user }),
      setToken: token => set({ token }),
      updateUser: updates =>
        set(state => ({
          user: state.user ? { ...state.user, ...updates } : null
        })),
      logout: () => set({ user: null, token: null })
    }),
    {
      name: 'auth-storage'
    }
  )
)
