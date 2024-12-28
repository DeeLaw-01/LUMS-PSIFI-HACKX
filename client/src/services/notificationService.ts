import axios from '@/lib/axios'

interface NotificationResponse {
  _id: string
  recipient: string
  type: 'STARTUP_POST' | 'STARTUP_FOLLOW'
  startup: string
  content: string
  read: boolean
  relatedId?: string
  createdAt: string
  updatedAt: string
}

interface FollowResponse {
  following: boolean
  message: string
}

class NotificationService {
  async getNotifications(): Promise<NotificationResponse[]> {
    const response = await axios.get('/api/notifications')
    return response.data
  }

  async markAsRead(notificationId: string): Promise<void> {
    await axios.put(`/api/notifications/${notificationId}/read`)
  }

  async markAllAsRead(): Promise<void> {
    await axios.put('/api/notifications/read-all')
  }

  async followStartup(startupId: string): Promise<FollowResponse> {
    const response = await axios.post(`/api/startups/${startupId}/follow`)
    return response.data
  }

  async unfollowStartup(startupId: string): Promise<FollowResponse> {
    const response = await axios.post(`/api/startups/${startupId}/unfollow`)
    return response.data
  }
}

export default new NotificationService() 