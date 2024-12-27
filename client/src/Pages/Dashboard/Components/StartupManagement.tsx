import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/hooks/use-toast'

interface Startup {
  _id: string
  name: string
  description: string
  isFollowing: boolean
  isMember: boolean
}

const StartupManagement = () => {
  const [startups, setStartups] = useState<Startup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, token } = useAuthStore()
  const { toast } = useToast()

  useEffect(() => {
    fetchStartups()
  }, [])

  const fetchStartups = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/startups/user`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setStartups(response.data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch startups',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = async (startupId: string, action: 'follow' | 'unfollow' | 'leave') => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/startups/${startupId}/${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      fetchStartups() // Refresh the list
      
      toast({
        title: 'Success',
        description: `Successfully ${action}ed the startup`
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} the startup`,
        variant: 'destructive'
      })
    }
  }

  if (isLoading) {
    return <div className="text-slate-200">Loading...</div>
  }

  return (
    <div className="space-y-4">
      {startups.map(startup => (
        <div 
          key={startup._id} 
          className="bg-slate-800 p-4 rounded-lg border border-slate-700"
        >
          <h3 className="text-xl font-semibold text-slate-200">{startup.name}</h3>
          <p className="text-slate-400 mt-2">{startup.description}</p>
          
          <div className="mt-4 space-x-4">
            {startup.isFollowing ? (
              <button
                onClick={() => handleAction(startup._id, 'unfollow')}
                className="px-4 py-2 text-sm text-slate-200 bg-slate-700 rounded-lg 
                         hover:bg-slate-600 transition-colors"
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={() => handleAction(startup._id, 'follow')}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg 
                         hover:bg-blue-700 transition-colors"
              >
                Follow
              </button>
            )}
            
            {startup.isMember && (
              <button
                onClick={() => handleAction(startup._id, 'leave')}
                className="px-4 py-2 text-sm text-red-400 bg-slate-700 rounded-lg 
                         hover:bg-slate-600 transition-colors"
              >
                Leave Startup
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default StartupManagement 