import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Share2, Settings } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import type { Startup } from '@/types/startup'
import { Dialog, DialogContent } from '@/Components/ui/dialog'
import StartupSettings from '../Sections/StartupSettings'

interface StartupHeaderProps {
  startup: Startup
  userRole?: string
  onRefresh: () => void
}

const StartupHeader = ({ startup, userRole, onRefresh }: StartupHeaderProps) => {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <>
      <div className='bg-card border-b border-border'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex flex-col md:flex-row md:items-start justify-between gap-4'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
              {startup.logo ? (
                <img
                  src={startup.logo}
                  alt={startup.displayName}
                  className='w-16 h-16 rounded-lg object-cover'
                />
              ) : (
                <div className='w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0'>
                  <Building2 className='w-8 h-8 text-primary' />
                </div>
              )}
              <div>
                <div className='flex flex-wrap items-center gap-2'>
                  <h1 className='text-xl md:text-2xl font-bold'>{startup.displayName}</h1>
                  {userRole && (
                    <Badge variant='secondary'>{userRole}</Badge>
                  )}
                </div>
                <p className='text-muted-foreground mt-1 text-sm md:text-base'>
                  {startup.description}
                </p>
                <div className='flex flex-wrap items-center gap-2 mt-2'>
                  <Badge variant='outline'>{startup.industry}</Badge>
                  <Badge variant='outline'>{startup.timelineStatus}</Badge>
                  {startup.fundraised > 0 && (
                    <Badge variant='outline'>
                      ${startup.fundraised.toLocaleString()} Raised
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className='flex items-center gap-2 mt-4 md:mt-0'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleShare}
                className='gap-2'
              >
                <Share2 className='w-4 h-4' />
                {copied ? 'Copied!' : 'Share'}
              </Button>
              {userRole === 'OWNER' && (
                <Button
                  size='sm'
                  onClick={() => setShowSettings(true)}
                  className='gap-2'
                >
                  <Settings className='w-4 h-4' />
                  Manage
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <StartupSettings 
            startup={startup} 
            onClose={() => setShowSettings(false)}
            onUpdate={() => {
              onRefresh()
              setShowSettings(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default StartupHeader 