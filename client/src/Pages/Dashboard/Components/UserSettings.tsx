import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/hooks/use-toast'
import api from '@/lib/axios'
import { Input } from '@/Components/ui/input'
import { Button } from '@/Components/ui/button'
import { Textarea } from '@/Components/ui/textarea'
import { Switch } from '@/Components/ui/switch'
import { Label } from '@/Components/ui/label'
import { Loader2, Upload, X } from 'lucide-react'
import axios from 'axios'
import imageCompression from 'browser-image-compression'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/Components/ui/alert-dialog'

const CLOUDINARY_UPLOAD_PRESET = 'ylmqjrhi'
const CLOUDINARY_CLOUD_NAME = 'drqdsjywx'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

interface UserSettingsProps {
  onClose?: () => void
}

export interface UserSettingsRef {
  checkUnsavedChanges: () => boolean
}

const UserSettings = forwardRef<UserSettingsRef, UserSettingsProps>(
  ({ onClose }, ref) => {
    const { user, setUser } = useAuthStore()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
      useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [formData, setFormData] = useState({
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
      profilePicture: user?.profilePicture || '',
      emailNotifications: user?.settings?.emailNotifications ?? true,
      darkMode: user?.settings?.darkMode ?? true
    })

    // Track initial form state for comparison
    const [initialFormData, setInitialFormData] = useState(formData)

    useImperativeHandle(ref, () => ({
      checkUnsavedChanges: () => {
        if (hasUnsavedChanges) {
          setShowUnsavedChangesDialog(true)
          return true
        }
        return false
      }
    }))

    useEffect(() => {
      // Check for unsaved changes
      const hasChanges = Object.keys(formData).some(
        key =>
          formData[key as keyof typeof formData] !==
          initialFormData[key as keyof typeof formData]
      )
      setHasUnsavedChanges(hasChanges)
    }, [formData, initialFormData])

    const handleInputChange = (e: any) => {
      const { name, value } = e.target
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    const handleToggleChange = (name: string) => {
      setFormData((prev: any) => ({
        ...prev,
        [name]: !prev[name]
      }))
    }

    const validateFile = (file: File) => {
      const MAX_FILE_SIZE = 7 * 1024 * 1024 // 7MB

      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size should not exceed 7MB')
      }
      if (!file.type.startsWith('image/')) {
        throw new Error('Uploaded file is not an image')
      }
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

    const handleImageUpload = async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file = e.target.files?.[0]
      if (!file) return

      try {
        setIsUploading(true)
        validateFile(file)

        const compressedFile = await compressImage(file)
        const data = new FormData()
        data.append('file', compressedFile)
        data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

        const res = await axios.post(CLOUDINARY_UPLOAD_URL, data, {
          withCredentials: false
        })

        setFormData(prev => ({
          ...prev,
          profilePicture: res.data.secure_url
        }))

        toast({
          title: 'Success',
          description: 'Profile picture uploaded successfully'
        })
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to upload profile picture',
          variant: 'destructive'
        })
      } finally {
        setIsUploading(false)
      }
    }

    const handleSubmit = async (e: any) => {
      e.preventDefault()
      setIsLoading(true)

      try {
        const response = await api.put('/api/users/update', formData)
        setUser(response.data)
        setInitialFormData(formData) // Update initial form data after successful save
        setHasUnsavedChanges(false)
        toast({
          title: 'Success',
          description: 'Your profile has been updated'
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to update profile',
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }

    const handleClose = () => {
      if (hasUnsavedChanges) {
        setShowUnsavedChangesDialog(true)
      } else if (onClose) {
        onClose()
      }
    }

    return (
      <>
        <div className='bg-card border border-border rounded-lg p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-semibold'>Profile Settings</h2>
            {hasUnsavedChanges && (
              <span className='text-sm text-red-500'>
                You have unsaved changes
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Profile Picture Section */}
            <div className='space-y-4'>
              <Label>Profile Picture</Label>
              <div className='flex items-center gap-4'>
                <div className='relative'>
                  <img
                    src={
                      formData.profilePicture ||
                      `https://ui-avatars.com/api/?name=${formData.username}`
                    }
                    alt='Profile'
                    className='w-24 h-24 rounded-full object-cover border-2 border-border'
                  />
                  {formData.profilePicture && (
                    <button
                      type='button'
                      onClick={() =>
                        setFormData(prev => ({ ...prev, profilePicture: '' }))
                      }
                      className='absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600'
                    >
                      <X className='w-4 h-4' />
                    </button>
                  )}
                </div>
                <div>
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload}
                    className='hidden'
                    id='profile-picture'
                  />
                  <Label
                    htmlFor='profile-picture'
                    className='inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-md cursor-pointer hover:bg-primary/20 transition-colors'
                  >
                    {isUploading ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      <Upload className='w-4 h-4' />
                    )}
                    Upload New Picture
                  </Label>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Recommended: Square image, at least 400x400px
                  </p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <Label htmlFor='username'>Username</Label>
                <Input
                  id='username'
                  name='username'
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  value={formData.email}
                  disabled
                  className='bg-muted cursor-not-allowed'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='location'>Location</Label>
                <Input
                  id='location'
                  name='location'
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='website'>Website</Label>
                <Input
                  id='website'
                  name='website'
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='bio'>Bio</Label>
              <Textarea
                id='bio'
                name='bio'
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
              />
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Preferences</h3>

              <div className='flex items-center justify-between'>
                <Label htmlFor='emailNotifications'>Email Notifications</Label>
                <Switch
                  id='emailNotifications'
                  checked={formData.emailNotifications}
                  onCheckedChange={() =>
                    handleToggleChange('emailNotifications')
                  }
                />
              </div>

              <div className='flex items-center justify-between'>
                <Label htmlFor='darkMode'>Dark Mode</Label>
                <Switch
                  id='darkMode'
                  checked={formData.darkMode}
                  onCheckedChange={() => handleToggleChange('darkMode')}
                />
              </div>
            </div>

            <div className='flex justify-end gap-4'>
              <Button type='button' variant='outline' onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type='submit'
                className='text-white bg-red-600 hover:bg-red-700'
                disabled={isLoading || !hasUnsavedChanges}
              >
                {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        <AlertDialog
          open={showUnsavedChangesDialog}
          onOpenChange={setShowUnsavedChangesDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes. Are you sure you want to leave? Your
                changes will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setShowUnsavedChangesDialog(false)}
              >
                Continue Editing
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setShowUnsavedChangesDialog(false)
                  if (onClose) onClose()
                }}
                className='bg-red-600 text-white hover:bg-red-700'
              >
                Discard Changes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }
)

export default UserSettings
