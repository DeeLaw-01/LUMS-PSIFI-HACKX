import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import UserPosts from './Components/UserPosts'
import SavedPosts from './Components/SavedPosts'
import { useAuthStore } from '@/store/useAuthStore'
import ProfileCard from './Components/ProfileCard'
import {
  ScrollText,
  Bookmark,
  Building2,
  Plus,
  Users,
  ChevronRight
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Separator } from '@/Components/ui/separator'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getUserStartups } from '@/services/startupService'
import { useToast } from '../../hooks/use-toast'
import type { Startup } from '@/types/startup'
import StartupSection from './Components/StartupSection'

const UserDashboard = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Redirect anonymous users to auth page
    if (user?.isAnonymous) {
      navigate('/auth')
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to access your dashboard',
        variant: 'default'
      })
      return
    }
    fetchStartups()
  }, [user])

  const fetchStartups = async () => {
    try {
      setLoading(true)
      const data = await getUserStartups()
      setStartups(data)
    } catch (error: any) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // Prevent rendering for anonymous users
  if (user?.isAnonymous) {
    return null
  }

  return (
    <div className='container  mx-auto px-4 pt-20 pb-10 min-h-screen'>
      {/* Profile Overview Section */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        {/* Left Sidebar */}
        <div className='lg:col-span-3 space-y-6'>
          <ProfileCard user={user} isCurrentUser={true}  />
          <StartupSection userId={user?._id} />
        </div>

        {/* Main Content */}
        <div className='lg:col-span-9'>
          <Tabs defaultValue='posts' className='w-full'>
            <TabsList className='bg-card border border-border mb-6'>
              <TabsTrigger value='posts' className='flex items-center gap-2'>
                <ScrollText className='w-4 h-4' />
                My Posts
              </TabsTrigger>
              <TabsTrigger value='saved' className='flex items-center gap-2'>
                <Bookmark className='w-4 h-4' />
                Saved Posts
              </TabsTrigger>
            </TabsList>

            <TabsContent value='posts'>
              <UserPosts />
            </TabsContent>

            <TabsContent value='saved'>
              <SavedPosts />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
