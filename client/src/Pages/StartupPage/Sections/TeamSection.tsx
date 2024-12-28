import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/hooks/use-toast'
import {
  updateMemberRole,
  updateMemberPosition,
  removeMember,
  createInviteLink
} from '@/services/startupService'
import type { Startup } from '@/types/startup'
import {
  Users,
  UserPlus,
  Link,
  MoreVertical,
  Loader2,
  Copy
} from 'lucide-react'
import { Button } from '@/Components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/Components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/Components/ui/dialog'
import { Input } from '@/Components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/Components/ui/select'
import { Badge } from '@/Components/ui/badge'


interface TeamSectionProps {
  startup: Startup
  userRole?: string
  onUpdate: () => void
}

const TeamSection = ({ startup, userRole, onUpdate }: TeamSectionProps) => {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteRole, setInviteRole] = useState<'EDITOR' | 'VIEWER'>('VIEWER')
  const [inviteLink, setInviteLink] = useState('')
  const [editingMember, setEditingMember] = useState<{
    userId: string
    position: string
  } | null>(null)

  const isOwner = userRole === 'OWNER'
  console.log("startup", startup)
  const handleCreateInvite = async () => {
    try {
      setLoading(true)
      const response = await createInviteLink(startup._id, inviteRole)
      const fullInviteLink = `${window.location.origin}/startup/join?code=${response.code}`
      setInviteLink(fullInviteLink)
    } catch (error: any) {
        console.log("error making link", error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create invite link',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      toast({
        title: 'Success',
        description: 'Invite link copied to clipboard'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy invite link',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      setLoading(true)
      await updateMemberRole(startup._id, userId, newRole as 'OWNER' | 'EDITOR' | 'VIEWER')
      onUpdate()
      toast({
        title: 'Success',
        description: 'Member role updated successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update role',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePosition = async () => {
    if (!editingMember) return

    try {
      setLoading(true)
      await updateMemberPosition(startup._id, editingMember.userId, editingMember.position)
      onUpdate()
      setEditingMember(null)
      toast({
        title: 'Success',
        description: 'Position updated successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update position',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (userId: string) => {
    try {
      setLoading(true)
      await removeMember(startup._id, userId)
      onUpdate()
      toast({
        title: 'Success',
        description: 'Member removed successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to remove member',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Team Management Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold'>Team Members</h2>
          <p className='text-muted-foreground'>
            Manage your startup's team and roles
          </p>
        </div>
        {isOwner && (
          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className='gap-2'>
                <UserPlus className='w-4 h-4' />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Create an invite link to share with potential team members
                </DialogDescription>
              </DialogHeader>
              <div className='space-y-4 py-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Member Role</label>
                  <Select
                    value={inviteRole}
                    onValueChange={(value) => setInviteRole(value as 'EDITOR' | 'VIEWER')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select role' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='EDITOR'>Editor</SelectItem>
                      <SelectItem value='VIEWER'>Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {inviteLink && (
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Invite Link</label>
                    <div className='flex gap-2'>
                      <Input value={inviteLink} readOnly />
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={handleCopyInvite}
                      >
                        <Copy className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setInviteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateInvite} disabled={loading}>
                  {loading ? (
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  ) : (
                    <Link className='w-4 h-4 mr-2' />
                  )}
                  Generate Link
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Team Members List */}
      <div className='grid gap-4'>
        {startup.team.map(member => (
          <Card key={member.user._id}>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  {member.user.profilePicture ? (
                    <img
                      src={member.user.profilePicture}
                      alt={member.user.username}
                      className='w-10 h-10 rounded-full object-cover'
                    />
                  ) : (
                    <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                      <Users className='w-5 h-5 text-primary' />
                    </div>
                  )}
                  <div>
                    <div className='flex items-center gap-2'>
                      <h3 className='font-medium'>{member.user.username}</h3>
                      <Badge variant='secondary'>{member.role}</Badge>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      {member.position || 'No position set'}
                    </p>
                  </div>
                </div>

                {isOwner && member.user._id !== user?._id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon'>
                        <MoreVertical className='w-4 h-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        onClick={() =>
                          setEditingMember({
                            userId: member.user._id,
                            position: member.position
                          })
                        }
                      >
                        Edit Position
                      </DropdownMenuItem>
                      {member.role !== 'OWNER' && (
                        <>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateRole(member.user._id, 'EDITOR')
                            }
                          >
                            Make Editor
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateRole(member.user._id, 'VIEWER')
                            }
                          >
                            Make Viewer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className='text-destructive'
                            onClick={() => handleRemoveMember(member.user._id)}
                          >
                            Remove Member
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Position Dialog */}
      <Dialog
        open={!!editingMember}
        onOpenChange={(open) => !open && setEditingMember(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Position</DialogTitle>
            <DialogDescription>
              Update the team member's position in the startup
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Position</label>
              <Input
                value={editingMember?.position || ''}
                onChange={(e) =>
                  setEditingMember(prev =>
                    prev ? { ...prev, position: e.target.value } : null
                  )
                }
                placeholder="e.g., 'Product Manager' or 'Lead Developer'"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setEditingMember(null)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdatePosition} disabled={loading}>
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

export default TeamSection 