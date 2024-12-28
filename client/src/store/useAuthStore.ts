import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  _id: string
  username: string
  email: string
  profilePicture?: string
  bio?: string
  location?: string
  website?: string
  settings?: {
    emailNotifications: boolean
    darkMode: boolean
  }
  startups?: Array<{
    startup: {
      _id: string
      displayName: string
      logo?: string
      description: string
      industry: string
      timelineStatus: string
    }
    role: 'OWNER' | 'EDITOR' | 'VIEWER'
    position: string
    joinedAt: Date
  }>
}

interface AuthStore {
  user: User | null
  token: string | null
  isNewUser: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setIsNewUser: (isNewUser: boolean) => void
  updateUser: (updates: Partial<User>) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      user: null,
      token: null,
      isNewUser: false,
      setUser: user => set({ user }),
      setToken: token => set({ token }),
      setIsNewUser: isNewUser => set({ isNewUser }),
      updateUser: updates =>
        set(state => ({
          user: state.user ? { ...state.user, ...updates } : null
        })),
      logout: () => set({ user: null, token: null, isNewUser: false })
    }),
    {
      name: 'auth-storage'
    }
  )
)
