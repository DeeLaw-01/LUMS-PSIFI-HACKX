import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/hooks/use-toast'
import { createStartup } from '@/services/startupService'
import {
  Building2,
  Upload,
  Loader2,
  ArrowLeft
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/Components/ui/card'
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
import axios from 'axios'
import imageCompression from 'browser-image-compression'

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

const CreateStartup = () => {
  const { user, setUser } = useAuthStore()
  const navigate = useNavigate()
  const { toast } = useToast()
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
      coordinates: [0, 0] // Default coordinates
    }
  })

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

  const handleSubmit = async () => {
    try {
      setIsLoading(true)

      const startupData = {
        ...formData,
        description: formData.description || 'No description provided',
        industry: formData.industry || 'SERVICE_BASED',
        timelineStatus: formData.timelineStatus || 'IDEATION'
      }

      const response = await createStartup(startupData)

      // Update user's local state with the new startup
      if (user) {
        setUser({
          ...user,
          startups: [
            ...(user.startups || []),
            {
              startup: response._id,
              role: 'OWNER',
              position: 'Founder',
              joinedAt: new Date()
            }
          ]
        })
      }

      toast({
        title: 'Success',
        description: 'Startup created successfully!'
      })
      
      // Navigate to the new startup's page
      navigate(`/startup/${response._id}`)
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

  return (
    <div className='min-h-screen bg-background pt-20 pb-10'>
      <div className='container max-w-4xl mx-auto px-4'>
        <Button
          variant='ghost'
          className='mb-6'
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className='w-4 h-4 mr-2' />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Create a New Startup</CardTitle>
            <CardDescription>
              Fill in the details to establish your startup's presence
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Logo Upload */}
            <div className='space-y-4'>
              <label className='block text-sm font-medium'>Logo</label>
              <div className='flex items-center gap-6'>
                <div className='relative group'>
                  <div className='w-24 h-24 rounded-xl bg-card border-2 border-dashed border-muted flex items-center justify-center overflow-hidden'>
                    {formData.logo ? (
                      <img
                        src={formData.logo}
                        alt='Startup Logo'
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <Building2 className='w-8 h-8 text-muted-foreground' />
                    )}
                  </div>
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
                    className='inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors'
                  >
                    {isUploading ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      <Upload className='w-4 h-4' />
                    )}
                    Upload Logo
                  </label>
                  <p className='text-xs text-muted-foreground'>
                    Recommended: Square image, max 7MB
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className='grid gap-6'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium'>
                  Display Name
                </label>
                <Input
                  name='displayName'
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder='Enter your startup name'
                />
              </div>

              <div className='space-y-2'>
                <label className='block text-sm font-medium'>
                  Description
                </label>
                <Textarea
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder='What makes your startup unique?'
                  rows={4}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>
                    Industry
                  </label>
                  <Select
                    value={formData.industry}
                    onValueChange={value => handleSelectChange('industry', value)}
                  >
                    <SelectTrigger>
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
                  <label className='block text-sm font-medium'>
                    Timeline Status
                  </label>
                  <Select
                    value={formData.timelineStatus}
                    onValueChange={value =>
                      handleSelectChange('timelineStatus', value)
                    }
                  >
                    <SelectTrigger>
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
                  <label className='block text-sm font-medium'>
                    Funds Raised (USD)
                  </label>
                  <Input
                    type='number'
                    name='fundraised'
                    value={formData.fundraised}
                    onChange={handleInputChange}
                    placeholder='0'
                    min='0'
                  />
                </div>
              </div>
            </div>

            <div className='flex justify-end gap-4 pt-6'>
              <Button
                variant='outline'
                onClick={() => navigate('/dashboard')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !formData.displayName}
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CreateStartup 