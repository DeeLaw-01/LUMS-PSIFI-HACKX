import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

import { updateStartup, deleteStartup, getStartup } from '@/services/startupService'
import {
  Building2,
  Upload,
  Loader2,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/Components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/Components/ui/card'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/Components/ui/alert-dialog'
import axios from 'axios'
import imageCompression from 'browser-image-compression'

const CLOUDINARY_UPLOAD_PRESET = 'ylmqjrhi'
const CLOUDINARY_CLOUD_NAME = 'drqdsjywx'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

interface StartupSettingsProps {
    //@ts-ignore
  startup: Startup
  onClose: () => void
  onUpdate: () => void
}

const StartupSettings = ({ startup, onClose, onUpdate }: StartupSettingsProps) => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [formData, setFormData] = useState({
    logo: startup.logo || '',
    displayName: startup.displayName,
    description: startup.description,
    industry: startup.industry,
    fundraised: startup.fundraised,
    timelineStatus: startup.timelineStatus
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1000
      })

      const data = new FormData()
      data.append('file', compressedFile)
      data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

      const res = await axios.post(CLOUDINARY_UPLOAD_URL, data)

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
      setLoading(true)
      await updateStartup(startup._id, formData)
      toast({
        title: 'Success',
        description: 'Startup updated successfully'
      })
      onUpdate()
    } catch (error: any) {
      console.error('Update error:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update startup',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      await deleteStartup(startup._id)
      navigate('/dashboard')
      toast({
        title: 'Success',
        description: 'Startup deleted successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete startup',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className='space-y-6 p-2'>
      <Card>
        <CardContent className='p-4 md:p-6'>
          <div className='space-y-6'>
            <div className='space-y-4'>
              <div className='flex flex-col sm:flex-row items-start gap-4'>
                {/* Logo Upload Section */}
                <div className='w-full sm:w-32'>
                  {formData.logo ? (
                    <img
                      src={formData.logo}
                      alt='Startup Logo'
                      className='w-32 h-32 rounded-lg object-cover'
                    />
                  ) : (
                    <div className='w-32 h-32 rounded-lg bg-primary/10 flex items-center justify-center'>
                      <Building2 className='w-12 h-12 text-primary' />
                    </div>
                  )}
                  <label className='mt-2 flex flex-col items-center justify-center w-32 h-10 rounded-md border border-dashed cursor-pointer hover:bg-secondary/50'>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleLogoUpload}
                      className='hidden'
                    />
                    {isUploading ? (
                      <Loader2 className='w-6 h-6 animate-spin' />
                    ) : (
                      <>
                        <Upload className='w-6 h-6' />
                        <span className='text-xs mt-1'>Upload Logo</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Form Fields */}
                <div className='flex-1 w-full space-y-4'>
                  <div>
                    <label className='text-sm font-medium'>Name</label>
                    <Input
                      name='displayName'
                      value={formData.displayName}
                      onChange={handleInputChange}
                      placeholder='Enter startup name'
                    />
                  </div>

                  <div>
                    <label className='text-sm font-medium'>Description</label>
                    <Textarea
                      name='description'
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium'>Industry</label>
                  <Select
                    value={formData.industry}
                    onValueChange={value => handleSelectChange('industry', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='SERVICE_BASED'>Service Based</SelectItem>
                      <SelectItem value='PRODUCT_BASED'>Product Based</SelectItem>
                      <SelectItem value='HYBRID'>Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className='text-sm font-medium'>Timeline Status</label>
                  <Select
                    value={formData.timelineStatus}
                    onValueChange={value =>
                      handleSelectChange('timelineStatus', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='IDEATION'>Ideation</SelectItem>
                      <SelectItem value='MVP'>MVP</SelectItem>
                      <SelectItem value='EARLY_TRACTION'>Early Traction</SelectItem>
                      <SelectItem value='SCALING'>Scaling</SelectItem>
                      <SelectItem value='ESTABLISHED'>Established</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className='text-sm font-medium'>Funds Raised (USD)</label>
                  <Input
                    type='number'
                    name='fundraised'
                    value={formData.fundraised}
                    onChange={handleInputChange}
                    min='0'
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col-reverse sm:flex-row justify-between gap-4 pt-4'>
              <Button
                variant='destructive'
                onClick={() => setShowDeleteDialog(true)}
                disabled={loading}
                className='w-full sm:w-auto'
              >
                Delete Startup
              </Button>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  onClick={onClose}
                  disabled={loading}
                  className='flex-1 sm:flex-none'
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !formData.displayName}
                  className='flex-1 sm:flex-none'
                >
                  {loading ? (
                    <>
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              startup and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className='bg-destructive hover:bg-destructive/90'
            >
              {loading ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <>
                  <AlertTriangle className='w-4 h-4 mr-2' />
                  Delete Startup
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default StartupSettings 