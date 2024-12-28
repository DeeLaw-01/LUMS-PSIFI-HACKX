import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/hooks/use-toast'
import api from '@/lib/axios'
import {
  Building2,
  Upload,
  Loader2,
  ArrowRight,
  Sparkles,
  Search,
  Link as LinkIcon,
  Users,
  Clock,
  Rocket
} from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Textarea } from '@/Components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/Components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/Components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/Components/ui/card'
import axios from 'axios'
import imageCompression from 'browser-image-compression'
import type { Startup } from '@/types/startup'

// Constants remain the same
const CLOUDINARY_UPLOAD_PRESET = 'ylmqjrhi'
const CLOUDINARY_CLOUD_NAME = 'drqdsjywx'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

const INDUSTRIES = [
  { value: 'SERVICE_BASED', label: 'Service Based' },
  { value: 'PRODUCT_BASED', label: 'Product Based' },
  { value: 'HYBRID', label: 'Hybrid' }
]

const TIMELINE_STATUSES = [
  { value: 'IDEATION', label: 'Ideation' },
  { value: 'MVP', label: 'MVP' },
  { value: 'EARLY_TRACTION', label: 'Early Traction' },
  { value: 'SCALING', label: 'Scaling' },
  { value: 'ESTABLISHED', label: 'Established' }
]

type OnboardingStep = 'CHOICE' | 'CREATE' | 'JOIN' | 'COMPLETE'

const StartupOnboarding = () => {
  // State and handlers remain the same
  const navigate = useNavigate()
  const { user, setUser, setIsNewUser } = useAuthStore()
  const { toast } = useToast()
  const [step, setStep] = useState<OnboardingStep>('CHOICE')
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    logo: '',
    displayName: '',
    description: '',
    industry: '',
    fundraised: 0,
    timelineStatus: 'IDEATION',
    location: {
      type: 'Point',
      coordinates: [0, 0]
    }
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Startup[]>([])
  const [loading, setLoading] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const [message, setMessage] = useState('')

  // Existing handlers remain the same
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1000,
      useWebWorker: true
    }
    try {
      return await imageCompression(file, options)
    } catch (error) {
      console.error('Error occurred while compressing image', error)
      return file
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const compressedFile = await compressImage(file)
      const data = new FormData()
      data.append('file', compressedFile)
      data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

      const res = await axios.post(CLOUDINARY_UPLOAD_URL, data, {
        withCredentials: false
      })

      setFormData(prev => ({
        ...prev,
        logo: res.data.secure_url
      }))

      toast({
        title: 'Success',
        description: 'Logo uploaded successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload logo',
        variant: 'destructive'
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSkip = () => {
    setIsNewUser(false)
    navigate('/')
  }

  const handleCreateStartup = async () => {
    try {
      setIsLoading(true)

      const startupData = {
        ...formData,
        team: [
          {
            user: user?._id,
            role: 'OWNER',
            position: 'Founder',
            joinedAt: new Date()
          }
        ],
        description: formData.description || 'No description provided',
        industry: formData.industry || 'SERVICE_BASED',
        timelineStatus: formData.timelineStatus || 'IDEATION',
        location: {
          type: 'Point',
          coordinates: formData.location.coordinates || [0, 0]
        }
      }

      const response = await api.post('api/startups', startupData)
      
      // Update the user's local state with the new startup
      if (user) {
        setUser({
          ...user,
          startups: [
            ...(user.startups || []),
            {
              startup: response.data._id,
              role: 'OWNER',
              position: 'Founder',
              joinedAt: new Date()
            }
          ]
        })
      }

      setIsNewUser(false)
      toast({
        title: 'Success',
        description: 'Startup created successfully!'
      })
      setStep('COMPLETE')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create startup',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = () => {
    setIsNewUser(false)
    navigate('/')
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await api.get(`/api/startups/search?q=${searchQuery}`)
      setSearchResults(response.data)
      
      if (response.data.length === 0) {
        toast({
          title: 'No Results',
          description: 'No startups found matching your search',
          variant: 'default'
        })
      }
    } catch (error: any) {
      console.error('Search error:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to search startups',
        variant: 'destructive'
      })
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleRequestToJoin = async (startupId: string) => {
    setLoading(true)
    try {
      await api.post('/api/startups/join/request', {
        startupId,
        message
      })
      toast({
        title: 'Success',
        description: 'Request to join startup sent successfully'
      })
      setStep('COMPLETE')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send request to join startup',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleJoinViaInvite = async () => {
    setLoading(true)
    try {
      await api.post('/api/startups/join/invite', {
        inviteCode
      })
      toast({
        title: 'Success',
        description: 'Joined startup successfully'
      })
      setStep('COMPLETE')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to join startup',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const renderChoice = () => (
    <div className='space-y-8'>
      <div className='text-center space-y-4'>
        <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-500 mb-6'>
          <Sparkles className='w-10 h-10 text-white' />
        </div>
        <h1 className='text-4xl font-bold tracking-tight text-white'>
          Welcome to SparkUp!
        </h1>
        <p className='text-lg text-gray-400 max-w-md mx-auto'>
          Let's get you started on your startup journey
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <button
          onClick={() => setStep('CREATE')}
          className='group relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-900/80 to-gray-900 p-1 hover:from-red-500 hover:to-red-500 transition-all duration-300'
        >
          <div className='relative rounded-lg bg-gray-900 p-6 h-full'>
            <div className='mb-4'>
              <div className='w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors'>
                <Rocket className='w-6 h-6 text-red-500' />
              </div>
            </div>
            <h3 className='text-xl font-semibold text-white mb-2'>
              Create a Startup
            </h3>
            <p className='text-gray-400 text-sm'>
              Start your own organization and build your team from scratch
            </p>
            <ArrowRight className='w-5 h-5 text-red-500 absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity' />
          </div>
        </button>

        <button
          onClick={() => setStep('JOIN')}
          className='group relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-900/80 to-gray-900 p-1 hover:from-red-500 hover:to-red-500 transition-all duration-300'
        >
          <div className='relative rounded-lg bg-gray-900 p-6 h-full'>
            <div className='mb-4'>
              <div className='w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors'>
                <Users className='w-6 h-6 text-red-500' />
              </div>
            </div>
            <h3 className='text-xl font-semibold text-white mb-2'>
              Join a Startup
            </h3>
            <p className='text-gray-400 text-sm'>
              Connect with existing startups and become part of their journey
            </p>
            <ArrowRight className='w-5 h-5 text-red-500 absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity' />
          </div>
        </button>

        <button
          onClick={handleSkip}
          className='group relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-900/80 to-gray-900 p-1 hover:from-red-500 hover:to-red-500 transition-all duration-300'
        >
          <div className='relative rounded-lg bg-gray-900 p-6 h-full'>
            <div className='mb-4'>
              <div className='w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors'>
                <Clock className='w-6 h-6 text-red-500' />
              </div>
            </div>
            <h3 className='text-xl font-semibold text-white mb-2'>
              Skip for Now
            </h3>
            <p className='text-gray-400 text-sm'>
              Explore the platform first and decide later
            </p>
            <ArrowRight className='w-5 h-5 text-red-500 absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity' />
          </div>
        </button>
      </div>
    </div>
  )

  const renderCreateForm = () => (
    <div className='space-y-8'>
      <div className='space-y-2'>
        <h2 className='text-3xl font-bold text-white'>Create Your Startup</h2>
        <p className='text-gray-400'>
          Fill in the details to establish your startup's presence
        </p>
      </div>

      <div className='space-y-6'>
        {/* Logo Upload */}
        <div className='space-y-4'>
          <label className='block text-sm font-medium text-gray-300'>
            Logo
          </label>
          <div className='flex items-center gap-6'>
            <div className='relative group'>
              <div className='w-24 h-24 rounded-xl bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden'>
                {formData.logo ? (
                  <img
                    src={formData.logo}
                    alt='Startup Logo'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <Building2 className='w-8 h-8 text-gray-600' />
                )}
              </div>
              <div className='absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl' />
            </div>
            <div className='space-y-2'>
              <Input
                type='file'
                accept='image/*'
                onChange={handleLogoUpload}
                className='hidden'
                id='logo-upload'
              />
              <label
                htmlFor='logo-upload'
                className='inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg cursor-pointer hover:bg-red-500/20 transition-colors'
              >
                {isUploading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Upload className='w-4 h-4' />
                )}
                Upload Logo
              </label>
              <p className='text-xs text-gray-500'>
                Recommended: Square image, max 7MB
              </p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className='grid gap-6'>
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-300'>
              Display Name
            </label>
            <Input
              name='displayName'
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder='Enter your startup name'
              className='bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500'
            />
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-300'>
              Description
            </label>
            <Textarea
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              placeholder='What makes your startup unique?'
              rows={4}
              className='bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-300'>
                Industry
              </label>
              <Select
                value={formData.industry}
                onValueChange={value => handleSelectChange('industry', value)}
              >
                <SelectTrigger className='bg-gray-800 border-gray-700 text-white'>
                  <SelectValue placeholder='Select industry' />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map(industry => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-300'>
                Timeline Status
              </label>
              <Select
                value={formData.timelineStatus}
                onValueChange={value =>
                  handleSelectChange('timelineStatus', value)
                }
              >
                <SelectTrigger className='bg-gray-800 border-gray-700 text-white'>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  {TIMELINE_STATUSES.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-300'>
                Funds Raised (USD)
              </label>
              <Input
                type='number'
                name='fundraised'
                value={formData.fundraised}
                onChange={handleInputChange}
                placeholder='0'
                min='0'
                className='bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500'
              />
            </div>
          </div>
        </div>

        <div className='flex justify-end gap-4 pt-6'>
          <Button
            variant='outline'
            onClick={() => setStep('CHOICE')}
            className='bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800'
          >
            Back
          </Button>
          <Button
            onClick={handleCreateStartup}
            disabled={isLoading}
            className='bg-red-500 text-white hover:bg-red-600'
          >
            {isLoading ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Creating...
              </>
            ) : (
              'Create Startup'
            )}
          </Button>
        </div>
      </div>
    </div>
  )

  const renderJoinForm = () => (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h2 className='text-3xl font-bold text-white'>Join a Startup</h2>
        <p className='text-gray-400'>
          Search for startups or use an invite code to join
        </p>
      </div>

      <div className='bg-gray-900 rounded-lg'>
        <Tabs defaultValue='search'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='search'>Search Startups</TabsTrigger>
            <TabsTrigger value='invite'>Join via Invite</TabsTrigger>
          </TabsList>

          <TabsContent value='search' className='space-y-4 p-4'>
            <div className='flex gap-2'>
              <Input
                placeholder='Search startups by name...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className='bg-gray-800 border-gray-700 text-white'
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Search className='w-4 h-4' />
                )}
              </Button>
            </div>

            {searchResults.length > 0 ? (
              <div className='space-y-4'>
                {searchResults.map(startup => (
                  <Card key={startup._id} className='bg-gray-800 border-gray-700'>
                    <CardHeader>
                      <div className='flex items-center gap-4'>
                        {startup.logo ? (
                          <img
                            src={startup.logo}
                            alt={startup.displayName}
                            className='w-12 h-12 rounded-lg object-cover'
                          />
                        ) : (
                          <div className='w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center'>
                            <Building2 className='w-6 h-6 text-gray-400' />
                          </div>
                        )}
                        <div>
                          <CardTitle className='text-white'>{startup.displayName}</CardTitle>
                          <p className='text-sm text-gray-400'>{startup.industry}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className='text-sm text-gray-400 mb-4'>
                        {startup.description}
                      </p>
                      <div className='space-y-4'>
                        <Textarea
                          placeholder='Why do you want to join this startup? (optional)'
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                          className='bg-gray-800 border-gray-700 text-white'
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
              </div>
            ) : searchQuery && !loading ? (
              <div className='text-center py-8 text-gray-400'>
                <p>No startups found matching your search</p>
                <p className='text-sm mt-2'>Try a different search term</p>
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value='invite' className='p-4'>
            <Card className='bg-gray-800 border-gray-700'>
              <CardHeader>
                <CardTitle className='text-white'>Join via Invite Code</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex gap-2'>
                  <Input
                    placeholder='Enter invite code'
                    value={inviteCode}
                    onChange={e => setInviteCode(e.target.value)}
                    className='bg-gray-800 border-gray-700 text-white'
                    //@ts-ignore
                    icon={
                      <LinkIcon className='w-4 h-4 text-gray-400' />
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

      <div className='flex justify-end gap-4'>
        <Button
          variant='outline'
          onClick={() => setStep('CHOICE')}
          className='bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800'
        >
          Back
        </Button>
      </div>
    </div>
  )

  const renderComplete = () => (
    <div className='space-y-8 text-center'>
      <div className='space-y-4'>
        <div className='w-24 h-24 bg-gradient-to-br from-red-500 to-red-500 rounded-full flex items-center justify-center mx-auto'>
          <Rocket className='w-12 h-12 text-white' />
        </div>
        <h2 className='text-3xl font-bold text-white'>Congratulations!</h2>
        <p className='text-gray-400 max-w-md mx-auto'>
          Your startup has been created successfully. You're now ready to start
          building your team and sharing updates.
        </p>
      </div>
      <Button
        onClick={handleComplete}
        className='bg-red-500 text-white hover:bg-red-600'
      >
        Go to Dashboard
      </Button>
    </div>
  )

  const renderStep = () => {
    switch (step) {
      case 'CHOICE':
        return renderChoice()
      case 'CREATE':
        return renderCreateForm()
      case 'JOIN':
        return renderJoinForm()
      case 'COMPLETE':
        return renderComplete()
    }
  }

  return (
    <div className='min-h-screen bg-gray-900 flex items-center justify-center p-4 md:p-8'>
      <div className='w-full max-w-4xl'>{renderStep()}</div>
    </div>
  )
}

export default StartupOnboarding
