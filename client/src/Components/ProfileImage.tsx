import React, { useState, useEffect } from 'react'
import { UserCircle } from 'lucide-react'

interface ProfileImageProps {
  src?: string
  alt: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

const ProfileImage = ({ src, alt, size = 'md', className = '', onClick }: ProfileImageProps) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  }

  return (
    <div 
      className={`relative rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className='w-full h-full object-cover'
        />
      ) : (
        <div className='w-full h-full bg-gray-800 flex items-center justify-center'>
          <span className='text-gray-400 text-xl'>{alt[0]?.toUpperCase()}</span>
        </div>
      )}
    </div>
  )
}

export default ProfileImage
