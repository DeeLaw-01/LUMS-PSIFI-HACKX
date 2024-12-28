import api from '@/lib/axios'
import type { Startup } from '@/types/startup'

export const createStartup = async (data: {
  logo: string
  displayName: string
  description: string
  industry: string
  fundraised: number
  timelineStatus: string
  location: {
    type: 'Point'
    coordinates: [number, number]
  }
}) => {
  const response = await api.post('/api/startups', data)
  return response.data
}

export const getStartup = async (id: string) => {
  const response = await api.get(`/api/startups/${id}`)
  return response.data
}

export const getUserStartups = async () => {
  const response = await api.get('/api/startups/user/startups')
  return response.data
}

export const searchStartups = async (query: string) => {
  const response = await api.get(`/api/startups/search?q=${query}`)
  return response.data
}

export const requestToJoin = async (startupId: string, message?: string) => {
  const response = await api.post('/api/startups/join/request', {
    startupId,
    message
  })
  return response.data
}

export const handleJoinRequest = async (
  startupId: string,
  userId: string,
  status: 'ACCEPTED' | 'REJECTED',
  position?: string
) => {
  const response = await api.post('/api/startups/join/handle', {
    startupId,
    userId,
    status,
    position
  })
  return response.data
}

export const createInviteLink = async (
  startupId: string,
  role: 'EDITOR' | 'VIEWER' = 'VIEWER'
) => {
  try {
    const response = await api.post('/api/startups/invite/create', {
      startupId,
      role
    })
    return response.data
  } catch (error) {
    console.error('Create invite link error:', error)
    throw error
  }
}

export const joinViaInviteLink = async (
  startupId: string,
  inviteCode: string,
  position: string = ''
) => {
  try {
    const response = await api.post('/api/startups/join/invite', {
      startupId,
      inviteCode,
      position
    })
    return response.data
  } catch (error) {
    console.error('Join via invite link error:', error)
    throw error
  }
}

export const updateMemberRole = async (
  startupId: string,
  userId: string,
  role: 'OWNER' | 'EDITOR' | 'VIEWER'
) => {
  const response = await api.put('/api/startups/member/role', {
    startupId,
    userId,
    role
  })
  return response.data
}

export const updateMemberPosition = async (
  startupId: string,
  userId: string,
  position: string
) => {
  const response = await api.put('/api/startups/member/position', {
    startupId,
    userId,
    position
  })
  return response.data
}

export const removeMember = async (startupId: string, userId: string) => {
  const response = await api.delete('/api/startups/member', {
    data: { startupId, userId }
  })
  return response.data
}

export const getTeamMembers = async (startupId: string) => {
  const response = await api.get(`/api/startups/${startupId}/team`)
  return response.data
}

export const getJoinRequests = async (startupId: string) => {
  const response = await api.get(`/api/startups/${startupId}/requests`)
  return response.data
}

// Product Management
export const addProduct = async (startupId: string, data: {
  name: string
  description: string
  image?: string
  price?: number
  purchaseLink?: string
}) => {
  const response = await api.post(`/api/startups/${startupId}/products`, data)
  return response.data
}

export const updateProduct = async (
  startupId: string,
  productId: string,
  data: {
    name?: string
    description?: string
    image?: string
    price?: number
    purchaseLink?: string
  }
) => {
  const response = await api.put(
    `/api/startups/${startupId}/products/${productId}`,
    data
  )
  return response.data
}

export const deleteProduct = async (startupId: string, productId: string) => {
  const response = await api.delete(
    `/api/startups/${startupId}/products/${productId}`
  )
  return response.data
}

// Project Management
export const addProject = async (startupId: string, data: {
  name: string
  description: string
  image?: string
  clientName?: string
  completionDate?: string
  testimonial?: string
  projectUrl?: string
}) => {
  const response = await api.post(`/api/startups/${startupId}/projects`, data)
  return response.data
}

export const updateProject = async (
  startupId: string,
  projectId: string,
  data: {
    name?: string
    description?: string
    image?: string
    clientName?: string
    completionDate?: string
    testimonial?: string
    projectUrl?: string
  }
) => {
  const response = await api.put(
    `/api/startups/${startupId}/projects/${projectId}`,
    data
  )
  return response.data
}

export const deleteProject = async (startupId: string, projectId: string) => {
  const response = await api.delete(
    `/api/startups/${startupId}/projects/${projectId}`
  )
  return response.data
}

// Post Management
export const addPost = async (startupId: string, data: {
  title: string
  content: string
  image?: string
  link?: string
}) => {
  const response = await api.post(`/api/startups/${startupId}/posts`, data)
  return response.data
}

export const updatePost = async (
  startupId: string,
  postId: string,
  data: {
    title?: string
    content?: string
    image?: string
    link?: string
  }
) => {
  const response = await api.put(
    `/api/startups/${startupId}/posts/${postId}`,
    data
  )
  return response.data
}

export const deletePost = async (startupId: string, postId: string) => {
  const response = await api.delete(
    `/api/startups/${startupId}/posts/${postId}`
  )
  return response.data
}

// Timeline Management
export const getTimelineEvents = async (startupId: string) => {
  const response = await api.get(`/api/startups/${startupId}/timeline`)
  return response.data
}

export const addTimelineEvent = async (startupId: string, data: {
  title: string
  description: string
  date: string
  type: 'MILESTONE' | 'UPDATE' | 'ACHIEVEMENT'
}) => {
  const response = await api.post(`/api/startups/${startupId}/timeline`, data)
  return response.data
}

export const updateTimelineEvent = async (
  startupId: string,
  eventId: string,
  data: {
    title?: string
    description?: string
    date?: string
    type?: 'MILESTONE' | 'UPDATE' | 'ACHIEVEMENT'
  }
) => {
  const response = await api.put(
    `/api/startups/${startupId}/timeline/${eventId}`,
    data
  )
  return response.data
}

export const deleteTimelineEvent = async (startupId: string, eventId: string) => {
  const response = await api.delete(
    `/api/startups/${startupId}/timeline/${eventId}`
  )
  return response.data
}

const startupService = {
  createStartup,
  getStartup,
  getUserStartups,
  searchStartups,
  requestToJoin,
  handleJoinRequest,
  createInviteLink,
  joinViaInviteLink,
  updateMemberRole,
  updateMemberPosition,
  removeMember,
  getTeamMembers,
  getJoinRequests,
  addProduct,
  updateProduct,
  deleteProduct,
  addProject,
  updateProject,
  deleteProject,
  addPost,
  updatePost,
  deletePost,
  getTimelineEvents,
  addTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent
}

export default startupService
