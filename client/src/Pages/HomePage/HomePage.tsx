import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { Briefcase, BookMarked, Users2, User, Building2 } from 'lucide-react'
import { getRecentUsers } from '@/services/userService'
import startupService from '@/services/startupService'
import { useToast } from '@/hooks/use-toast'

import Feed from '@/Components/Feed'
import ProfileImage from '@/Components/ProfileImage'
import { Button } from '@/Components/ui/button.tsx'

interface RecentUser {
  _id: string
  username: string
  profilePicture?: string
  bio?: string
  role?: string
}

interface Startup {
  _id: string
  displayName: string
  description?: string
  logo?: string
  createdAt: string
}

const HomePage = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [recentStartups, setRecentStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const [startupLoading, setStartupLoading] = useState(true)

  useEffect(() => {
    fetchRecentUsers()
    fetchRecentStartups()
  }, [])

  const fetchRecentStartups = async () => {
    try {
      setStartupLoading(true)
      const startups = await startupService.getAllStartups()
      // Sort by creation date and take the 3 most recent
      const sortedStartups = startups
        .sort((a: Startup, b: Startup) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 3)
      setRecentStartups(sortedStartups)
    } catch (error: any) {
      console.error('Error fetching startups:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch recent startups',
        variant: 'destructive'
      })
    } finally {
      setStartupLoading(false)
    }
  }

  const fetchRecentUsers = async () => {
    try {
      setLoading(true)
      const data = await getRecentUsers(5)
      console.log('Recent users data:', data)
      const usersArray = Array.isArray(data) ? data : []
      const filteredUsers = usersArray.filter((u: RecentUser) => u._id !== user?._id)
      console.log('Filtered users:', filteredUsers)
      setRecentUsers(filteredUsers)
    } catch (error: any) {
      console.log('Error fetching users:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch recent users',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  

  return (
    <div className='max-w-[1440px] mx-auto px-4 pt-20 lg:px-8 min-h-screen mt-10'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-5'>
        {/* Left Sidebar - Now shows on mobile */}
        <div className='lg:col-span-3 space-y-5'>
          {/* Profile Card */}
          <div className='dark:bg-primary-800 bg-white backdrop-blur-sm border border-slate-800 rounded-lg overflow-hidden'>
            <div className='h-16 bg-gradient-to-tr from-red-500 to-red-600'></div>
            <div className='p-4 -mt-8'>
              <div className='flex justify-center'>
                <ProfileImage
                  src={user?.profilePicture}
                  alt={user?.username || 'User'}
                  size='lg'
                  className='border-4 border-slate-900'
                />
              </div>
              <div className='text-center mt-2'>
                <h2 className='text-lg font-semibold text-black dark:text-white'>
                  {user?.username}
                </h2>
                <p className='text-sm dark:text-slate-400 text-black'>
                  {user?.bio || 'No bio yet'}
                </p>
              </div>
              <div className='mt-4 pt-4 border-t border-slate-800'>
                <div className='flex justify-between text-sm'>
                  <span className='dark:text-slate-100 text-black'>
                    Profile views
                  </span>
                  <span className='text-blue-400'>142</span>
                </div>
                <div className='flex justify-between text-sm mt-2'>
                  <span className='dark:text-slate-100 text-black'>
                    Post impressions
                  </span>
                  <span className='text-blue-400'>1,234</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className='dark:bg-primary-800 bg-white backdrop-blur-sm border border-slate-800 rounded-lg p-4 dark:text-slate-300 text-black'>
            <div className='space-y-3'>
              <button
                onClick={() => navigate('/dashboard')}
                className='flex items-center w-full hover:text-red-400 transition-colors'
              >
                <User className='w-5 h-5 mr-2' />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className='flex items-center w-full hover:text-red-400 transition-colors'
              >
                <Building2 className='w-5 h-5 mr-2' />
                <span>My Startups</span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className='flex items-center w-full hover:text-red-400 transition-colors'
              >
                <Briefcase className='w-5 h-5 mr-2' />
                <span>Products</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className='lg:col-span-6 space-y-4'>
          <Feed />
        </main>

        {/* Right Sidebar - Now shows on mobile */}
        <aside className='lg:col-span-3 space-y-5'>
          {/* Recent Startups Section */}
          <div className='dark:bg-primary-800 bg-white backdrop-blur-sm border border-slate-800 rounded-lg p-4 dark:text-slate-300 text-black'>
            <h2 className='font-semibold dark:text-white text-black mb-4'>
              Recent Startups
            </h2>
            <div className='space-y-4'>
              {startupLoading ? (
                // Loading skeleton
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className='flex items-center space-x-3 animate-pulse'>
                    <div className='w-10 h-10 rounded-lg bg-gray-700' />
                    <div className='flex-1 space-y-2'>
                      <div className='h-4 bg-gray-700 rounded w-3/4' />
                      <div className='h-3 bg-gray-700 rounded w-1/2' />
                    </div>
                  </div>
                ))
              ) : recentStartups.length > 0 ? (
                recentStartups.map((startup) => (
                  <div 
                    key={startup._id} 
                    className='flex items-center space-x-3 cursor-pointer group'
                    onClick={() => navigate(`/startup/${startup._id}`)}
                  >
                    <div className='w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden'>
                      {startup.logo ? (
                        <img 
                          src={startup.logo} 
                          alt={startup.displayName} 
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <Briefcase className='w-6 h-6 text-gray-400' />
                      )}
                    </div>
                    <div className='flex-1'>
                      <h3 className='text-sm font-medium dark:text-slate-300 text-black group-hover:text-red-400 transition-colors'>
                        {startup.displayName}
                      </h3>
                      <p className='text-xs dark:text-slate-500 text-black mt-1'>
                        {startup.description?.slice(0, 50)}
                        {startup.description && startup.description.length > 50 ? '...' : ''}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-sm text-center dark:text-slate-400 text-black'>
                  No startups available
                </p>
              )}
            </div>
          </div>

          {/* Suggested Connections */}
          <div className='dark:bg-primary-800 bg-white backdrop-blur-sm border border-slate-800 rounded-lg p-4 dark:text-slate-300 text-black'>
            <h2 className='font-semibold dark:text-white text-black mb-4'>
              People You May Know
            </h2>
            <div className='space-y-4'>
              {loading ? (
                // Loading skeleton
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className='flex items-center space-x-3 animate-pulse'>
                    <div className='w-10 h-10 rounded-full bg-gray-700' />
                    <div className='flex-1 space-y-2'>
                      <div className='h-4 bg-gray-700 rounded w-3/4' />
                      <div className='h-3 bg-gray-700 rounded w-1/2' />
                    </div>
                  </div>
                ))
              ) : recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user._id} className='flex items-center space-x-3'>
                    <ProfileImage
                      src={user.profilePicture}
                      alt={user.username}
                      size='sm'
                      className='cursor-pointer'
                      onClick={() => navigate(`/profile/${user._id}`)}
                    />
                    <div className='flex-1'>
                      <button
                        onClick={() => navigate(`/profile/${user._id}`)}
                        className='text-sm font-medium dark:text-slate-300 text-black hover:text-red-400 dark:hover:text-red-400 transition-colors text-left'
                      >
                        {user.username}
                      </button>
                      <p className='text-xs dark:text-slate-400 text-black truncate'>
                        {user.bio || user.role || 'Member'}
                      </p>
                    </div>
                    <button
                        onClick={() => navigate(`/profile/${user._id}`)}
                      className='text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors'
                    >
                      View Profile
                    </button>
                  </div>
                ))
              ) : (
                <p className='text-sm text-center dark:text-slate-400 text-black'>
                  No suggestions available
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default HomePage
