import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { requestToJoin } from '@/services/startupService'
import { Button } from '@/Components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog'
import { Textarea } from '@/Components/ui/textarea'
import { Loader2 } from 'lucide-react'

interface JoinRequestDialogProps {
  startupId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const JoinRequestDialog = ({ startupId, open, onOpenChange, onSuccess }: JoinRequestDialogProps) => {
  const { toast } = useToast()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      await requestToJoin(startupId, message)
      toast({
        title: 'Success',
        description: 'Join request sent successfully'
      })
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send join request',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request to Join Startup</DialogTitle>
          <DialogDescription>
            Send a message to the startup owners explaining why you'd like to join.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Why would you like to join this startup?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Request'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default JoinRequestDialog 