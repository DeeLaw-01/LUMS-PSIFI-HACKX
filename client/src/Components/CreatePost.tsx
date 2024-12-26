import React, { useState } from 'react'
import { ImageIcon } from 'lucide-react'

interface CreatePostProps {
  onPostCreated: (content: string) => void
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      onPostCreated(content)
      setContent('')
    }
  }

  return (
    <div className='bg-primary-800 backdrop-blur-sm rounded-lg  border border-primary-600  p-4'>
      <form onSubmit={handleSubmit}>
        <textarea
          className='w-full p-2 bg-gray-900 border border-slate-700 rounded-lg resize-none 
                   focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent
                   text-white placeholder-slate-400'
          rows={3}
          placeholder="What's on your mind?"
          value={content}
          onChange={e => setContent(e.target.value)}
        ></textarea>
        <div className='flex justify-between items-center mt-2'>
          <button
            type='button'
            className='text-slate-400 hover:text-blue-400 transition-colors'
          >
            <ImageIcon className='w-6 h-6' />
          </button>
          <button
            type='submit'
            className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 
                     transition-colors duration-200 disabled:opacity-50'
          >
            Post
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost
