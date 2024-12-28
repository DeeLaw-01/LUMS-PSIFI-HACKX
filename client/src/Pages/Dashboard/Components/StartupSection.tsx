import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/hooks/use-toast'
import api from '@/lib/axios'
import {
  Building2,
  Plus,
  Users,
  Settings,
  ChevronRight,
  Clock,
  Loader2
} from 'lucide-react'
import { Button } from '@/Components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/Components/ui/card'
import { Badge } from '@/Components/ui/badge'
import { Separator } from '@/Components/ui/separator'
import { useNavigate } from 'react-router-dom'

interface Startup {
  _id: string
  logo: string
  displayName: string
  description: string
  industry: string
  timelineStatus: string
  team: Array<{
    user: {
      _id: string
      username: string
      profilePicture?: string
    }
    role: 'OWNER' | 'EDITOR' | 'VIEWER'
    position: string
  }>
}

const StartupSection = () => {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStartups()
  }, [])

  const fetchStartups = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/startups/user/startups')
      setStartups(response.data)
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to fetch startups',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateStartup = () => {
    navigate('/startup/create')
  }

  const handleJoinStartup = () => {
    navigate('/startup/join')
  }

  const handleManageStartup = (startupId: string) => {
    navigate(`/startup/${startupId}/manage`)
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <Loader2 className='w-6 h-6 animate-spin' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-semibold tracking-tight'>My Startups</h2>
          <p className='text-sm text-muted-foreground'>
            Manage your startups and team members
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            className='gap-2'
            onClick={handleJoinStartup}
          >
            <Users className='w-4 h-4' />
            Join Startup
          </Button>
          <Button className='gap-2' onClick={handleCreateStartup}>
            <Plus className='w-4 h-4' />
            Create Startup
          </Button>
        </div>
      </div>

      {startups.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Startups Yet</CardTitle>
            <CardDescription>
              Create your first startup or join an existing one to get started.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {startups.map(startup => {
            const userRole = startup.team.find(
              member => member.user._id === user?._id
            )?.role

            return (
              <Card key={startup._id} className='overflow-hidden'>
                <CardHeader className='pb-4'>
                  <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-3'>
                      {startup.logo ? (
                        <img
                          src={startup.logo}
                          alt={startup.displayName}
                          className='w-10 h-10 rounded-lg object-cover'
                        />
                      ) : (
                        <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                          <Building2 className='w-5 h-5 text-primary' />
                        </div>
                      )}
                      <div>
                        <CardTitle className='text-lg'>
                          {startup.displayName}
                        </CardTitle>
                        <div className='flex items-center gap-2 mt-1'>
                          <Badge variant='secondary'>{startup.industry}</Badge>
                          <Badge variant='outline' className='gap-1'>
                            <Clock className='w-3 h-3' />
                            {startup.timelineStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Badge>{userRole}</Badge>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className='pt-4'>
                  <p className='text-sm text-muted-foreground line-clamp-2 mb-4'>
                    {startup.description}
                  </p>
                  <div className='flex items-center justify-between'>
                    <div className='flex -space-x-2'>
                      {startup.team.slice(0, 4).map(member => (
                        <div
                          key={member.user._id}
                          className='w-8 h-8 rounded-full border-2 border-background overflow-hidden'
                          title={`${member.user.username} (${
                            member.position || member.role
                          })`}
                        >
                          {member.user.profilePicture ? (
                            <img
                              src={member.user.profilePicture}
                              alt={member.user.username}
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <div className='w-full h-full bg-primary/10 flex items-center justify-center'>
                              <Users className='w-4 h-4 text-primary' />
                            </div>
                          )}
                        </div>
                      ))}
                      {startup.team.length > 4 && (
                        <div className='w-8 h-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-xs font-medium'>
                          +{startup.team.length - 4}
                        </div>
                      )}
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='gap-2'
                      onClick={() => handleManageStartup(startup._id)}
                    >
                      {userRole === 'OWNER' ? (
                        <>
                          <Settings className='w-4 h-4' />
                          Manage
                        </>
                      ) : (
                        <>
                          View
                          <ChevronRight className='w-4 h-4' />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default StartupSection
