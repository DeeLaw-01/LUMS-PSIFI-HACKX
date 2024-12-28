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
  message: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  requestedAt: Date
}

export interface InviteLink {
  _id: string
  code: string
  role: 'EDITOR' | 'VIEWER'
  expiresAt: Date
  createdBy: {
    _id: string
    username: string
  }
}

export interface Product {
  _id: string
  name: string
  description: string
  image?: string
  price?: number
  purchaseLink?: string
  createdAt: Date
}

export interface Project {
  _id: string
  title: string
  description: string
  image?: string
  clientName?: string
  completionDate?: Date
  testimonial?: string
  projectUrl?: string
  createdAt: Date
}

export interface Post {
  _id: string
  title: string
  content: string
  image?: string
  link?: string
  author: {
    _id: string
    username: string
    profilePicture?: string
  }
  createdAt: Date
}

export interface Startup {
  _id: string
  logo?: string
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
  products: Product[]
  projects: Project[]
  posts: Post[]
  createdAt: Date
  updatedAt: Date
}
