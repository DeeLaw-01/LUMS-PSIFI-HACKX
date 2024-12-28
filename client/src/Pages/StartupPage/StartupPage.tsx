import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/hooks/use-toast'
import { getStartup } from '@/services/startupService'
import type { Startup } from '@/types/startup'
import {
  Building2,
  Users,
  ScrollText,
  Package,
  Briefcase,
  Settings,
  Share2,
  Clock,
  Loader2
} from 'lucide-react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/Components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import Timeline from '@/Components/Timeline'
import TeamSection from './Sections/TeamSection.tsx'
import PostsSection from './Sections/PostsSection.tsx'
import ProductsSection from './Sections/ProductsSection.tsx'
import ProjectsSection from './Sections/ProjectsSection.tsx'
import StartupHeader from './Components/StartupHeader.tsx'

const StartupPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [startup, setStartup] = useState<Startup | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStartupData()
  }, [id])

  const fetchStartupData = async () => {
    try {
      setLoading(true)
      if (!id) return
      const data = await getStartup(id)
      console.log("data:",data)
      setStartup(data)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch startup',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='w-6 h-6 animate-spin' />
      </div>
    )
  }

  if (!startup) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-2'>Startup not found</h1>
          <p className='text-muted-foreground mb-4'>
            The startup you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const userRole = startup?.team?.find(
    member => member.user._id === user?._id
  )?.role

  const canManage = userRole === 'OWNER' || userRole === 'EDITOR'

  return (
    <div className='min-h-screen bg-background mt-16'>
      <StartupHeader
        startup={startup}
        userRole={userRole}
        onRefresh={fetchStartupData}
      />

      <div className='container mx-auto px-4 py-6'>
        <Tabs defaultValue='timeline' className='space-y-6'>
          <TabsList className='bg-card border border-border'>
            <TabsTrigger value='timeline' className='flex items-center gap-2'>
              <Clock className='w-4 h-4' />
              Timeline
            </TabsTrigger>
            <TabsTrigger value='team' className='flex items-center gap-2'>
              <Users className='w-4 h-4' />
              Team
            </TabsTrigger>
            <TabsTrigger value='posts' className='flex items-center gap-2'>
              <ScrollText className='w-4 h-4' />
              Posts
            </TabsTrigger>
            {(startup.industry === 'PRODUCT_BASED' ||
              startup.industry === 'HYBRID') && (
              <TabsTrigger value='products' className='flex items-center gap-2'>
                <Package className='w-4 h-4' />
                Products
              </TabsTrigger>
            )}
            {(startup.industry === 'SERVICE_BASED' ||
              startup.industry === 'HYBRID') && (
              <TabsTrigger value='projects' className='flex items-center gap-2'>
                <Briefcase className='w-4 h-4' />
                Projects
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value='timeline'>
            <Timeline startupId={startup._id} canEdit={canManage} />
          </TabsContent>

          <TabsContent value='team'>
            <TeamSection
              startup={startup}
              userRole={userRole}
              onUpdate={fetchStartupData}
            />
          </TabsContent>

          <TabsContent value='posts'>
            <PostsSection
              startup={startup}
              canCreate={canManage}
              onUpdate={fetchStartupData}
            />
          </TabsContent>

          {(startup.industry === 'PRODUCT_BASED' ||
            startup.industry === 'HYBRID') && (
            <TabsContent value='products'>
              <ProductsSection
                startup={startup}
                canManage={canManage}
                onUpdate={fetchStartupData}
              />
            </TabsContent>
          )}

          {(startup.industry === 'SERVICE_BASED' ||
            startup.industry === 'HYBRID') && (
            <TabsContent value='projects'>
              <ProjectsSection
                startup={startup}
                canManage={canManage}
                onUpdate={fetchStartupData}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}

export default StartupPage
