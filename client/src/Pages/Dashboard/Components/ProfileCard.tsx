import { Button } from '@/Components/ui/button'
import { Edit, MapPin, Briefcase, Link as LinkIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useRef } from 'react'
import { Modal } from '@/Components/ui/Modal'
import UserSettings from './UserSettings'

interface ProfileCardProps {
  user: any
  isCurrentUser: boolean
}

const ProfileCard = ({ user, isCurrentUser }: ProfileCardProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const settingsRef = useRef<{ checkUnsavedChanges: () => boolean }>()

  const handleClose = () => {
    if (settingsRef.current?.checkUnsavedChanges()) {
      return
    }
    setIsSettingsOpen(false)
  }

  if (!user) return null

  return (
    <>
      <div className='bg-card border border-border rounded-lg overflow-hidden'>
        {/* Cover Image */}
        <div className='h-24 bg-gradient-to-r from-red-500 to-red-600' />

        {/* Profile Info */}
        <div className='p-4'>
          <div className='relative -mt-16 mb-4'>
            <img
              src={
                user.profilePicture ||
                `https://ui-avatars.com/api/?name=${user.username}`
              }
              alt={user.username}
              className='w-24 h-24 rounded-full border-4 border-card'
            />
          </div>

          <div className='space-y-4'>
            <div>
              <h2 className='text-xl font-semibold text-foreground'>
                {user.username}
              </h2>
              <p className='text-muted-foreground'>
                {user.bio || 'No bio added yet'}
              </p>
            </div>

            {user.location && (
              <div className='flex items-center gap-2 text-muted-foreground'>
                <MapPin className='w-4 h-4' />
                <span>{user.location}</span>
              </div>
            )}

            {user.company && (
              <div className='flex items-center gap-2 text-muted-foreground'>
                <Briefcase className='w-4 h-4' />
                <span>{user.company}</span>
              </div>
            )}

            {user.website && (
              <div className='flex items-center gap-2'>
                <LinkIcon className='w-4 h-4 text-muted-foreground' />
                <a
                  href={
                    user.website.startsWith('http')
                      ? user.website
                      : `https://${user.website}`
                  }
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-red-500 hover:text-red-600'
                >
                  {(() => {
                    try {
                      const url = new URL(
                        user.website.startsWith('http')
                          ? user.website
                          : `https://${user.website}`
                      )
                      return url.hostname
                    } catch (error) {
                      return user.website
                    }
                  })()}
                </a>
              </div>
            )}

            {isCurrentUser && <Button
              variant='outline'
              className='w-full mt-4 shadow-lg bg-red-500 text-white hover:bg-red-600 dark:hover:bg-white/90 dark:hover:text-black dark:bg-white dark:text-black hover:text-white'
              onClick={() => setIsSettingsOpen(true)}
            >
              <Edit className='w-4 h-4 mr-2' />
              Edit Profile
            </Button>}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isSettingsOpen}
        onClose={handleClose}
        onBackdropClick={handleClose}
        title='Settings'
        size='lg'
      >
        <UserSettings
          //@ts-ignore
          ref={settingsRef}
          onClose={() => setIsSettingsOpen(false)}
        />
      </Modal>
    </>
  )
}

export default ProfileCard
