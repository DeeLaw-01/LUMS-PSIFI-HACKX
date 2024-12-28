import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu'
import { ScrollArea } from '@/Components/ui/scroll-area'
import { Skeleton } from '@/Components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import notificationService from '@/services/notificationService'

interface Notification {
  _id: string
  type: 'STARTUP_POST' | 'STARTUP_FOLLOW'
  startup: {
    _id: string
    displayName: string
    logo?: string
  }
  content: string
  read: boolean
  relatedId?: string
  createdAt: string
}

const NotificationDropdown = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications()
      //@ts-ignore
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.read).length)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch notifications',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    try {
      if (!notification.read) {
        await notificationService.markAsRead(notification._id)
        setNotifications(prev =>
          prev.map(n =>
            n._id === notification._id ? { ...n, read: true } : n
          )
        )
        setUnreadCount(prev => prev - 1)
      }

      // Navigate based on notification type
      if (notification.type === 'STARTUP_POST' && notification.relatedId) {
        navigate(`/startup/${notification.startup._id}/post/${notification.relatedId}`)
      } else if (notification.type === 'STARTUP_FOLLOW') {
        navigate(`/startup/${notification.startup._id}`)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive'
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
      toast({
        title: 'Success',
        description: 'All notifications marked as read'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive'
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          {unreadCount > 0 && (
            <span className='absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center'>
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-80'>
        <div className='flex items-center justify-between px-4 py-2 border-b'>
          <h3 className='font-semibold'>Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant='ghost'
              size='sm'
              className='text-xs'
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className='h-[400px]'>
          {loading ? (
            <div className='p-4 space-y-4'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='flex items-start gap-3'>
                  <Skeleton className='h-8 w-8 rounded-full' />
                  <div className='space-y-2 flex-1'>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-3 w-3/4' />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className='p-4 text-center text-muted-foreground'>
              No notifications
            </div>
          ) : (
            notifications.map(notification => (
              <DropdownMenuItem
                key={notification._id}
                className={`px-4 py-3 cursor-pointer ${
                  !notification.read ? 'bg-primary/5' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className='flex items-start gap-3'>
                  <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0'>
                    {notification.startup.logo ? (
                      <img
                        src={notification.startup.logo}
                        alt={notification.startup.displayName}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <Bell className='w-4 h-4 text-primary' />
                    )}
                  </div>
                  <div className='space-y-1 flex-1'>
                    <p className='text-sm line-clamp-2'>{notification.content}</p>
                    <p className='text-xs text-muted-foreground'>
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationDropdown 