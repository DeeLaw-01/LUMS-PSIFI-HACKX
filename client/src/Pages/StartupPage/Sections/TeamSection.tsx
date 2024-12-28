import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/hooks/use-toast'
import {
  updateMemberRole,
  updateMemberPosition,
  removeMember,
  createInviteLink,
  handleJoinRequest
} from '@/services/startupService'
import type { Startup } from '@/types/startup'
import {
  Users,
  UserPlus,
  Link,
  MoreVertical,
  Loader2,
  Copy,
  Check,
  X
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar'
import JoinRequestDialog from '../Components/JoinRequestDialog'

interface TeamSectionProps {
  startup: Startup
  userRole?: string
  onUpdate: () => void
}

const TeamSection = ({ startup, userRole, onUpdate }: TeamSectionProps) => {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteRole, setInviteRole] = useState<'EDITOR' | 'VIEWER'>('VIEWER')
  const [inviteLink, setInviteLink] = useState('')
  const [editingMember, setEditingMember] = useState<{
    userId: string
    position: string
  } | null>(null)
  const [showJoinDialog, setShowJoinDialog] = useState(false)
  
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

  const handleRequest = async (userId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      setLoading(userId)
      await handleJoinRequest(startup._id, userId, status)
      toast({
        title: 'Success',
        description: `Request ${status.toLowerCase()} successfully`
      })
      onUpdate()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to handle request',
        variant: 'destructive'
      })
    } finally {
      setLoading(null)
    }
  }

  const pendingRequests = startup.joinRequests.filter(
    request => request.status === 'PENDING'
  )

  return (
    <div className='space-y-6'>
      {/* Team Management Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold'>Team Members</h2>
          <p className='text-muted-foreground'>
            {userRole ? 'Manage your startup\'s team and roles' : 'View team members'}
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

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          {isOwner && (
            <TabsTrigger value="requests">
              Join Requests
              {pendingRequests.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="members">
          {/* Public Team Members List */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                People currently working on this startup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {startup.team.map(member => (
                  <div
                    key={member.user._id}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center gap-4'>
                      <Avatar>
                        <AvatarImage src={member.user.profilePicture} />
                        <AvatarFallback>
                          {member.user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
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
                    
                    {/* Only show management options for owners */}
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
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isOwner && (
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Join Requests</CardTitle>
                <CardDescription>
                  People who want to join your startup
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingRequests.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No pending requests
                  </p>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map(request => (
                      <div
                        key={request.user._id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={request.user.profilePicture} />
                            <AvatarFallback>
                              {request.user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{request.user.username}</p>
                            <p className="text-sm text-muted-foreground">
                              {request.message}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRequest(request.user._id, 'REJECTED')}
                            disabled={!!loading}
                          >
                            {loading === request.user._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleRequest(request.user._id, 'ACCEPTED')}
                            disabled={!!loading}
                          >
                            {loading === request.user._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Show join request button only for non-members */}
      {!userRole && (
        <div className="flex justify-end">
          <Button onClick={() => setShowJoinDialog(true)}>
            Request to Join
          </Button>
        </div>
      )}

      <JoinRequestDialog
        startupId={startup._id}
        open={showJoinDialog}
        onOpenChange={setShowJoinDialog}
        onSuccess={onUpdate}
      />
    </div>
  )
}

export default TeamSection 