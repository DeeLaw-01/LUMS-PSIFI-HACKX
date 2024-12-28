export interface TeamMember {
  user: {
    _id: string
    username: string
    email: string
    profilePicture?: string
  }
  role: 'OWNER' | 'EDITOR' | 'VIEWER'
  position: string
  joinedAt: Date
}

export interface JoinRequest {
  user: {
    _id: string
    username: string
    email: string
    profilePicture?: string
  }
  message?: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  requestedAt: Date
}

export interface InviteLink {
  code: string
  role: 'EDITOR' | 'VIEWER'
  expiresAt: Date
  createdBy: {
    _id: string
    username: string
  }
}

export interface Startup {
  _id: string
  logo: string
  displayName: string
  description: string
  industry: 'SERVICE_BASED' | 'PRODUCT_BASED' | 'HYBRID'
  fundraised: number
  timelineStatus:
    | 'IDEATION'
    | 'MVP'
    | 'EARLY_TRACTION'
    | 'SCALING'
    | 'ESTABLISHED'
  location: {
    type: 'Point'
    coordinates: [number, number]
  }
  team: TeamMember[]
  joinRequests: JoinRequest[]
  inviteLinks: InviteLink[]
  createdAt: Date
  updatedAt: Date
}
