import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { getUserProfile } from '@/services/userService'
import ProfileCard from '@/Pages/Dashboard/Components/ProfileCard'
import StartupSection from '@/Pages/Dashboard/Components/StartupSection'
import UserPosts from '@/Components/UserPosts'
import { Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card'

interface UserProfileData {
  _id: string
  username: string
  bio: string
  location: string
  website: string
  profilePicture: string
  startups: Array<any>
}

const UserProfile = () => {
  const { id } = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserProfileData | null>(null)

  useEffect(() => {
    fetchUserProfile()
  }, [id])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const data = await getUserProfile(id!)
      setUserData(data)
    } catch (error: any) {
      console.error('Error fetching user profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to load user profile',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='w-8 h-8 animate-spin' />
      </div>
    )
  }

  if (!userData) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-lg text-muted-foreground'>User not found</p>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8 mt-16 min-h-screen'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        {/* Left Column - Profile Info */}
        <div className='lg:col-span-3'>
          <ProfileCard
            user={userData}
            isCurrentUser={false}
          />
        </div>

        {/* Right Column - Startups and Posts */}
        <div className='lg:col-span-9 space-y-6'>
          {/* Startups Section */}
          <StartupSection userId={userData._id} viewOnly />

          {/* Posts Section */}
          <Card>
            <CardHeader>
              <CardTitle>Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <UserPosts userId={userData._id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default UserProfile 