import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Clock, Plus, Loader2, Pencil, Trash } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/Components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/Components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu'
import { Input } from '@/Components/ui/input'
import { Textarea } from '@/Components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/Components/ui/select'
import { Badge } from '@/Components/ui/badge'
import {
  getTimelineEvents,
  addTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent
} from '@/services/startupService'

interface TimelineEvent {
  _id: string
  title: string
  description: string
  date: Date
  type: 'MILESTONE' | 'UPDATE' | 'ACHIEVEMENT'
  createdAt: Date
}

interface TimelineProps {
  startupId: string
  canEdit: boolean
}

const Timeline = ({ startupId, canEdit }: TimelineProps) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'UPDATE' as const
  })

  useEffect(() => {
    fetchEvents()
  }, [startupId])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const data = await getTimelineEvents(startupId)
      setEvents(data)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch timeline events',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTypeChange = (value: string) => {
    // @ts-ignore
    setFormData(prev => ({
      ...prev,
      type: value as 'MILESTONE' | 'UPDATE' | 'ACHIEVEMENT'
    }))
  }

  const handleCreateEvent = async () => {
    try {
      setLoading(true)
      const newEvent = await addTimelineEvent(startupId, formData)
      setEvents(prev => [...prev, newEvent])
      setCreateDialogOpen(false)
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: 'UPDATE'
      })

      toast({
        title: 'Success',
        description: 'Timeline event added successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create timeline event',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateEvent = async () => {
    if (!editingEvent) return

    try {
      setLoading(true)
      const updatedEvent = await updateTimelineEvent(
        startupId,
        editingEvent._id,
        formData
      )
      setEvents(prev =>
        prev.map(event =>
          event._id === editingEvent._id ? updatedEvent : event
        )
      )
      setEditingEvent(null)
      toast({
        title: 'Success',
        description: 'Timeline event updated successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update timeline event',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      setLoading(true)
      await deleteTimelineEvent(startupId, eventId)
      setEvents(prev => prev.filter(event => event._id !== eventId))
      toast({
        title: 'Success',
        description: 'Timeline event deleted successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete timeline event',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'MILESTONE':
        return 'bg-blue-500'
      case 'ACHIEVEMENT':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const renderEventForm = () => (
    <div className='space-y-4 py-4'>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Title</label>
        <Input
          name='title'
          value={formData.title}
          onChange={handleInputChange}
          placeholder='Enter event title'
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium'>Description</label>
        <Textarea
          name='description'
          value={formData.description}
          onChange={handleInputChange}
          placeholder='Describe the event...'
          rows={3}
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Date</label>
          <Input
            type='date'
            name='date'
            value={formData.date}
            onChange={handleInputChange}
          />
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Type</label>
          <Select value={formData.type} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='UPDATE'>Update</SelectItem>
              <SelectItem value='MILESTONE'>Milestone</SelectItem>
              <SelectItem value='ACHIEVEMENT'>Achievement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  return (
    <div className='space-y-6'>
      {/* Header with Add Button */}
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Timeline</h2>
        {canEdit && (
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className='gap-2'>
                <Plus className='w-4 h-4' />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Timeline Event</DialogTitle>
                <DialogDescription>
                  Create a new event in your startup's timeline
                </DialogDescription>
              </DialogHeader>
              {renderEventForm()}
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setCreateDialogOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateEvent}
                  disabled={loading || !formData.title || !formData.description}
                >
                  {loading ? (
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  ) : (
                    'Add Event'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Timeline Events */}
      <div className='space-y-4'>
        {loading && !events.length ? (
          <Card>
            <CardContent className='p-6 flex justify-center'>
              <Loader2 className='w-6 h-6 animate-spin' />
            </CardContent>
          </Card>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className='p-6 text-center'>
              <p className='text-muted-foreground'>No timeline events yet</p>
              {canEdit && (
                <p className='text-sm text-muted-foreground mt-1'>
                  Add your first timeline event to track your startup's journey
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          events.map((event, index) => (
            <div key={event._id} className='relative'>
              {index !== events.length - 1 && (
                <div
                  className='absolute left-6 top-12 bottom-0 w-0.5 bg-border'
                  aria-hidden='true'
                />
              )}
              <div className='flex gap-4'>
                <div
                  className={`w-12 h-12 rounded-full ${getEventTypeColor(
                    event.type
                  )} flex items-center justify-center flex-shrink-0`}
                >
                  <Clock className='w-6 h-6 text-white' />
                </div>
                <div className='flex-1'>
                  <Card>
                    <CardHeader>
                      <div className='flex items-center justify-between gap-4'>
                        <div>
                          <CardTitle>{event.title}</CardTitle>
                          <CardDescription>
                            {new Date(event.date).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Badge>{event.type}</Badge>
                          {canEdit && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant='ghost' size='icon'>
                                  <Pencil className='w-4 h-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingEvent(event)
                                    setFormData({
                                      title: event.title,
                                      description: event.description,
                                      date: new Date(event.date)
                                        .toISOString()
                                        .split('T')[0],
                                        // @ts-ignore
                                      type: event.type
                                    })
                                  }}
                                >
                                  <Pencil className='w-4 h-4 mr-2' />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className='text-destructive'
                                  onClick={() => handleDeleteEvent(event._id)}
                                >
                                  <Trash className='w-4 h-4 mr-2' />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className='text-sm text-muted-foreground'>
                        {event.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Event Dialog */}
      <Dialog
        open={!!editingEvent}
        onOpenChange={(open) => !open && setEditingEvent(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Timeline Event</DialogTitle>
            <DialogDescription>
              Update the event information
            </DialogDescription>
          </DialogHeader>
          {renderEventForm()}
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setEditingEvent(null)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateEvent}
              disabled={loading || !formData.title || !formData.description}
            >
              {loading ? (
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Timeline
