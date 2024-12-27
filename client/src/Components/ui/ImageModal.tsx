import React from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageModalProps {
  images: string[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

const ImageModal: React.FC<ImageModalProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious
}) => {
  if (!isOpen) return null

  return (
    <div
      className='fixed inset-0 z-50 bg-black/90 flex items-center justify-center'
      onClick={onClose}
    >
      <div className='relative w-full h-full flex items-center justify-center'>
        {/* Close button */}
        <button
          className='absolute top-4 right-4 text-white/80 hover:text-white z-10'
          onClick={onClose}
        >
          <X className='w-8 h-8' />
        </button>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              className={cn(
                'absolute left-4 text-white/80 hover:text-white z-10 transition-opacity',
                currentIndex === 0 && 'opacity-50 cursor-not-allowed'
              )}
              onClick={e => {
                e.stopPropagation()
                onPrevious()
              }}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className='w-8 h-8' />
            </button>
            <button
              className={cn(
                'absolute right-4 text-white/80 hover:text-white z-10 transition-opacity',
                currentIndex === images.length - 1 &&
                  'opacity-50 cursor-not-allowed'
              )}
              onClick={e => {
                e.stopPropagation()
                onNext()
              }}
              disabled={currentIndex === images.length - 1}
            >
              <ChevronRight className='w-8 h-8' />
            </button>
          </>
        )}

        {/* Image */}
        <div
          className='max-w-[90vw] max-h-[90vh] relative'
          onClick={e => e.stopPropagation()}
        >
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className='max-w-full max-h-[90vh] object-contain'
          />

          {/* Image counter */}
          {images.length > 1 && (
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm'>
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageModal
