export interface User {
  _id: string
  username: string
  email?: string
  profilePicture?: string
  bio?: string
  isAnonymous?: boolean
  anonymousId?: string
  settings?: {
    emailNotifications: boolean
    darkMode: boolean
  }
  permissions?: {
    canComment: boolean
    canMessage: boolean
    canCreateStartup: boolean
    canFollowStartup: boolean
    canJoinStartup: boolean
    canLike: boolean
    canSave: boolean
  }
  startups?: Array<{
    startup: string
    role: 'OWNER' | 'EDITOR' | 'VIEWER'
    position?: string
    joinedAt: Date
  }>
} 