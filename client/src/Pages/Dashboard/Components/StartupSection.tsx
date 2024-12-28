import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/hooks/use-toast'
import { getUserStartups } from '@/services/startupService'
import type { Startup } from '@/types/startup'
import {
  Building2,
  Plus,
  Users,
  ChevronRight,
  Loader2
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

const StartupSection = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStartups()
  }, [])

  const fetchStartups = async () => {
    try {
      setLoading(true)
      const data = await getUserStartups()
      setStartups(data)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch startups',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-start'>
          <div>
            <CardTitle>My Startups</CardTitle>
            <CardDescription>Startups you've created or joined</CardDescription>
            <div className='flex gap-2 mt-4'>
              <Button
                variant='outline'
                size='sm'
                className='gap-2'
                onClick={() => navigate('/startup/join')}
              >
                <Users className='w-4 h-4' />
                Join
              </Button>
              <Button
                size='sm'
                className='gap-2'
                onClick={() => navigate('/startup/create')}
              >
                <Plus className='w-4 h-4' />
                Create
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className='flex items-center justify-center p-6'>
            <Loader2 className='w-6 h-6 animate-spin' />
          </div>
        ) : startups.length === 0 ? (
          <div className='text-center py-6 text-muted-foreground'>
            <p>You haven't joined any startups yet.</p>
            <p className='text-sm'>Create your first startup or join an existing one.</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {startups.map(startup => {
              const userRole = startup.team.find(
                member => member.user._id === user?._id
              )?.role

              return (
                <div key={startup._id}>
                  <div className='flex items-center justify-between gap-4'>
                    <div className='flex items-center gap-3 min-w-0'>
                      {startup.logo ? (
                        <img
                          src={startup.logo}
                          alt={startup.displayName}
                          className='w-8 h-8 rounded-lg object-cover flex-shrink-0'
                        />
                      ) : (
                        <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0'>
                          <Building2 className='w-4 h-4 text-primary' />
                        </div>
                      )}
                      <div className='min-w-0'>
                        <h3 className='font-medium truncate text-sm'>
                          {startup.displayName}
                        </h3>
                        <div className='flex items-center gap-2'>
                          <Badge variant='secondary' className='truncate text-xs'>
                            {userRole}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-8 w-8 p-0'
                      onClick={() => navigate(`/startup/${startup._id}`)}
                    >
                      <ChevronRight className='w-4 h-4' />
                    </Button>
                  </div>
                  {startups.indexOf(startup) !== startups.length - 1 && (
                    <Separator className='my-4' />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default StartupSection
