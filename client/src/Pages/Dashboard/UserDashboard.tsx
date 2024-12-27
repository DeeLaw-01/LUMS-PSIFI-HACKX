import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import UserPosts from './Components/UserPosts'
import { useAuthStore } from '@/store/useAuthStore'
import ProfileCard from './Components/ProfileCard.tsx'
import { ScrollText } from 'lucide-react'

const UserDashboard = () => {
  const { user } = useAuthStore()

  return (
    <div className='container mx-auto px-4 pt-20 pb-10'>
      {/* Profile Overview Section */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        {/* Left Sidebar */}
        <div className='lg:col-span-3'>
          <ProfileCard user={user} />
        </div>

        {/* Main Content */}
        <div className='lg:col-span-9'>
          <Tabs defaultValue='posts' className='w-full'>
            <TabsList className='bg-card border border-border mb-6'>
              <TabsTrigger value='posts' className='flex items-center gap-2'>
                <ScrollText className='w-4 h-4' />
                My Posts
              </TabsTrigger>
            </TabsList>

            <TabsContent value='posts'>
              <UserPosts />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
