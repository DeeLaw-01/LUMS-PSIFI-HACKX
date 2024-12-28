import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import api from '@/lib/axios'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Textarea } from '@/Components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Loader2, Search, Link as LinkIcon } from 'lucide-react'

const JoinStartup = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [message, setMessage] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setLoading(true)
      const response = await api.get(`/api/startups/search?q=${searchQuery}`)
      setSearchResults(response.data)
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to search startups',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRequestToJoin = async (startupId: string) => {
    try {
      setLoading(true)
      await api.post('/api/startups/join/request', {
        startupId,
        message
      })
      toast({
        title: 'Success',
        description: 'Join request sent successfully'
      })
      navigate('/dashboard')
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to send join request',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleJoinViaInvite = async () => {
    try {
      setLoading(true)
      await api.post('/api/startups/join/invite', {
        inviteCode
      })
      toast({
        title: 'Success',
        description: 'Joined startup successfully'
      })
      navigate('/dashboard')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to join startup',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-screen md:pt-16'>
      <div className='container max-w-4xl  mx-auto py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold'>Join a Startup</h1>
          <p className='text-muted-foreground mt-2'>
            Search for startups or use an invite code to join
          </p>
        </div>

        <Tabs defaultValue='search'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='search'>Search Startups</TabsTrigger>
            <TabsTrigger value='invite'>Join via Invite</TabsTrigger>
          </TabsList>

          <TabsContent value='search' className='space-y-4'>
            <div className='flex gap-2'>
              <Input
                placeholder='Search startups by name...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Search className='w-4 h-4' />
                )}
              </Button>
            </div>

            {searchResults.map(startup => (
              <Card key={startup._id}>
                <CardHeader>
                  <CardTitle>{startup.displayName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground mb-4'>
                    {startup.description}
                  </p>
                  <div className='space-y-4'>
                    <Textarea
                      placeholder='Why do you want to join this startup? (optional)'
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                    />
                    <Button
                      className='w-full'
                      onClick={() => handleRequestToJoin(startup._id)}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className='w-4 h-4 animate-spin mr-2' />
                      ) : null}
                      Request to Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value='invite'>
            <Card>
              <CardHeader>
                <CardTitle>Join via Invite Code</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex gap-2'>
                  <Input
                    placeholder='Enter invite code'
                    value={inviteCode}
                    onChange={e => setInviteCode(e.target.value)}
                    //@ts-ignore
                    icon={
                      <LinkIcon className='w-4 h-4 text-muted-foreground' />
                    }
                  />
                </div>
                <Button
                  className='w-full'
                  onClick={handleJoinViaInvite}
                  disabled={loading || !inviteCode}
                >
                  {loading ? (
                    <Loader2 className='w-4 h-4 animate-spin mr-2' />
                  ) : null}
                  Join Startup
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default JoinStartup
