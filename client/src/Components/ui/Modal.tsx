import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  onBackdropClick?: () => void
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw] max-h-[95vh]'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  onBackdropClick
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (onBackdropClick) {
      onBackdropClick()
    } else {
      onClose()
    }
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-start justify-center sm:items-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto'
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          'dark:bg-primary-800 bg-white rounded-lg shadow-xl w-full relative max-h-[90vh] overflow-y-auto',
          'scrollbar-thin scrollbar-thumb-red-500/50 hover:scrollbar-thumb-red-500/70 scrollbar-track-gray-800 scrollbar-thumb-rounded-full',
          sizeClasses[size]
        )}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className='flex items-center justify-between p-4 border-b border-primary-700 sticky top-0 bg-inherit z-10'>
            <h2 className='text-lg font-semibold text-foreground'>{title}</h2>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-white transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
          </div>
        )}
        <div className='p-4'>{children}</div>
      </div>
    </div>
  )
}
