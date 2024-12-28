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
  role: 'EDITOR' | 'VIEWER' = 'VIEWER',
  expiresInDays: number = 7
) => {
  const response = await api.post('/api/startups/invite/create', {
    startupId,
    role,
    expiresInDays
  })
  return response.data
}

export const joinViaInviteLink = async (
  inviteCode: string,
  position?: string
) => {
  const response = await api.post('/api/startups/join/invite', {
    inviteCode,
    position
  })
  return response.data
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
  getJoinRequests
}

export default startupService
