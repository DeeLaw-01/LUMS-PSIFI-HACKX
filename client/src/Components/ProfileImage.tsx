import React, { useState, useEffect } from 'react'
import { UserCircle } from 'lucide-react'

interface ProfileImageProps {
  src?: string | null
  alt: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-20 h-20'
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt,
  className = '',
  size = 'md'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (src) {
      const img = new Image()
      img.src = src
      img.onload = () => setImageLoaded(true)
      img.onerror = () => setImageError(true)
    }
  }, [src])

  if (!src || imageError) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-primary-700 flex items-center justify-center ${className}`}
      >
        <UserCircle className='w-full h-full text-gray-300' />
      </div>
    )
  }

  return (
    <>
      {!imageLoaded && (
        <div
          className={`${sizeClasses[size]} rounded-full bg-primary-700 animate-pulse ${className}`}
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`${
          sizeClasses[size]
        } rounded-full border border-primary-500 ${className} ${
          imageLoaded ? 'block' : 'hidden'
        }`}
        onError={() => setImageError(true)}
      />
    </>
  )
}

export default ProfileImage
