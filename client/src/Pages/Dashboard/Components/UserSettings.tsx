import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'

const UserSettings = () => {
  const { user, token, setUser } = useAuthStore()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/update`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      setUser(response.data.user)
      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update profile',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="mt-1 w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     text-white placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     text-white placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            className="mt-1 w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     text-white placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="mt-1 w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     text-white placeholder-slate-400"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800
                   transition-colors duration-200"
        >
          Update Profile
        </button>
      </form>
    </div>
  )
}

export default UserSettings 