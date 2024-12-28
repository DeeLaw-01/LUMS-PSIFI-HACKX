import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Loader2, Check } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu'
import { Badge } from '@/Components/ui/badge'
import { ScrollArea } from '@/Components/ui/scroll-area'
import notificationService, { Notification } from '@/services/notificationService'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const NotificationsDropdown = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const [notifs, count] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getUnreadCount()
      ])
      setNotifications(notifs)
      setUnreadCount(count)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchNotifications()
    }
  }, [open])

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark as read
      if (!notification.read) {
        await notificationService.markAsRead(notification._id)
        setUnreadCount(prev => Math.max(0, prev - 1))
        setNotifications(notifications.map(n => 
          n._id === notification._id ? { ...n, read: true } : n
        ))
      }

      // Navigate based on notification type
      switch (notification.type) {
        case 'STARTUP_POST':
          navigate(`/startup/${notification.startup._id}?tab=posts`)
          break
        case 'STARTUP_PRODUCT':
          navigate(`/startup/${notification.startup._id}?tab=products`)
          break
        case 'STARTUP_PROJECT':
          navigate(`/startup/${notification.startup._id}?tab=projects`)
          break
        case 'STARTUP_UPDATE':
          navigate(`/startup/${notification.startup._id}?tab=timeline`)
          break
      }

      setOpen(false)
    } catch (error) {
      console.error('Error handling notification:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(notifications.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
      toast({
        title: 'Success',
        description: 'All notifications marked as read'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark notifications as read',
        variant: 'destructive'
      })
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-8 text-sm"
            >
              <Check className="w-4 h-4 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map(notification => (
              <DropdownMenuItem
                key={notification._id}
                className={cn(
                  'flex items-start gap-3 p-4 cursor-pointer',
                  !notification.read && 'bg-muted/50'
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                {notification.startup.logo ? (
                  <img
                    src={notification.startup.logo}
                    alt={notification.startup.displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {notification.startup.displayName[0]}
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <p className={cn('text-sm', !notification.read && 'font-medium')}>
                    {notification.content}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationsDropdown 