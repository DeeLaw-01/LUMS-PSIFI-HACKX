import React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
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
  size = 'md'
}) => {
  if (!isOpen) return null

  return (
    <div
      className='fixed  inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm'
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-primary-800 rounded-lg shadow-xl w-full relative overflow-hidden',
          sizeClasses[size]
        )}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className='flex items-center justify-between p-4 border-b border-primary-700'>
            <h2 className='text-lg font-semibold text-white'>{title}</h2>
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
