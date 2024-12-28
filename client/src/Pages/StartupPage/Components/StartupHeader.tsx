import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/hooks/use-toast'
import type { Startup } from '@/types/startup'
import {
  Building2,
  MapPin,
  Users,
  DollarSign,
  Settings,
  Share2,
  Copy,
  Check,
  Bell,
  BellOff
} from 'lucide-react'
import { Button } from '@/Components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/Components/ui/dialog'
import { Input } from '@/Components/ui/input'
import { Badge } from '@/Components/ui/badge'
import notificationService from '@/services/notificationService'

interface StartupHeaderProps {
  startup: Startup & { followers?: Array<{ user: string }> }
  userRole?: string
  onRefresh: () => void
}

interface FollowerType {
  user: string
}

const StartupHeader = ({ startup, userRole, onRefresh }: StartupHeaderProps) => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if user is following the startup
    const followers = startup.followers || []
    setIsFollowing(
      followers.some(
        (follower: FollowerType) => follower.user === user?._id
      )
    )
  }, [startup.followers, user?._id])

  const handleShare = () => {
    setShareDialogOpen(true)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: 'Success',
        description: 'Link copied to clipboard'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link',
        variant: 'destructive'
      })
    }
  }

  const handleFollow = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      const response = await notificationService.followStartup(startup._id)
      setIsFollowing(response.following)
      toast({
        title: response.following ? 'Following' : 'Unfollowed',
        description: response.following
          ? `You will now receive notifications from ${startup.displayName}`
          : `You will no longer receive notifications from ${startup.displayName}`
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update follow status',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-card border-b'>
      <div className='container mx-auto px-4 py-6'>
        <div className='flex flex-col md:flex-row gap-6 items-start md:items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden'>
              {startup.logo ? (
                <img
                  src={startup.logo}
                  alt={startup.displayName}
                  className='w-full h-full object-cover'
                />
              ) : (
                <Building2 className='w-8 h-8 text-primary' />
              )}
            </div>
            <div>
              <h1 className='text-2xl font-bold'>{startup.displayName}</h1>
              <div className='flex flex-wrap gap-2 mt-1'>
                <Badge variant='secondary'>{startup.industry}</Badge>
                <Badge variant='secondary'>{startup.timelineStatus}</Badge>
              </div>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            {/* Follow Button - Only show if user is not a team member */}
            {!userRole && (
              <Button
                variant={isFollowing ? 'secondary' : 'default'}
                onClick={handleFollow}
                disabled={loading}
                className='gap-2'
              >
                {isFollowing ? (
                  <BellOff className='w-4 h-4' />
                ) : (
                  <Bell className='w-4 h-4' />
                )}
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}

            <Button variant='outline' onClick={handleShare} className='gap-2'>
              <Share2 className='w-4 h-4' />
              Share
            </Button>

            {userRole === 'OWNER' && (
              <Button
                variant='outline'
                onClick={() => navigate(`/startup/${startup._id}/settings`)}
                className='gap-2'
              >
                <Settings className='w-4 h-4' />
                Settings
              </Button>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Users className='w-4 h-4' />
            <span>
              {startup.team.length} team member{startup.team.length !== 1 && 's'}
            </span>
          </div>
          {startup.location?.coordinates && (
            <div className='flex items-center gap-2 text-muted-foreground'>
              <MapPin className='w-4 h-4' />
              <span>
                {startup.location.coordinates[1]}, {startup.location.coordinates[0]}
              </span>
            </div>
          )}
          {startup.fundraised > 0 && (
            <div className='flex items-center gap-2 text-muted-foreground'>
              <DollarSign className='w-4 h-4' />
              <span>${startup.fundraised.toLocaleString()} raised</span>
            </div>
          )}
        </div>

        {startup.description && (
          <p className='mt-4 text-muted-foreground'>{startup.description}</p>
        )}
      </div>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Startup</DialogTitle>
            <DialogDescription>
              Share this startup's profile with others
            </DialogDescription>
          </DialogHeader>
          <div className='flex gap-2'>
            <Input value={window.location.href} readOnly />
            <Button variant='outline' size='icon' onClick={handleCopy}>
              {copied ? (
                <Check className='w-4 h-4 text-green-500' />
              ) : (
                <Copy className='w-4 h-4' />
              )}
            </Button>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShareDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default StartupHeader 