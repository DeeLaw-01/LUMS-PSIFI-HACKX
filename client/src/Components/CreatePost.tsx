import React, { useState, useEffect } from 'react'
import {
  ImageIcon,
  Eye,
  EyeOff,
  HelpCircle,
  PenSquare,
  Code,
  Loader2,
  Trash2,
  Upload
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import postService from '../services/postService'
import { Button } from '@/Components/ui/button'
import { useAuthStore } from '../store/useAuthStore'
import { cn } from '@/lib/utils'
import { Modal } from './ui/Modal'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import imageCompression from 'browser-image-compression'
import { useToast } from '@/hooks/use-toast'
import SparklesText from './ui/sparkles-text.tsx'

const CLOUDINARY_UPLOAD_PRESET = 'ylmqjrhi'
const CLOUDINARY_CLOUD_NAME = 'drqdsjywx'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

interface CreatePostProps {
  onPostCreated: (post: any) => void
}

const markdownHelp = {
  preview: `
### Text Formatting
**Bold text** 
*Italic text* 
~~Strikethrough~~

### Headers
# Heading 1
## Heading 2
### Heading 3

### Lists
- Unordered list item
- Another item
  - Nested item

1. Ordered list item
2. Another item
   1. Nested item

### Links and Images
[Link text](https://example.com)
![Image alt text](image.jpg)

### Code
\`Inline code\`

\`\`\`javascript
// Code block
function hello() {
  console.log('Hello world!');
}
\`\`\`

### Quotes and Dividers
> Blockquote text

---

### Tables
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |

### Task Lists
- [x] Completed task
- [ ] Incomplete task
`,
  raw: `
### Text Formatting
\`\`\`
**Bold text**
*Italic text*
~~Strikethrough~~
\`\`\`

### Headers
\`\`\`
# Heading 1
## Heading 2
### Heading 3
\`\`\`

### Lists
\`\`\`
- Unordered list item
- Another item
  - Nested item

1. Ordered list item
2. Another item
   1. Nested item
\`\`\`

### Links and Images
\`\`\`
[Link text](https://example.com)
![Image alt text](image.jpg)
\`\`\`

### Code
\`\`\`
\`Inline code\`

\`\`\`language
// Code block
function hello() {
  console.log('Hello world!');
}
\`\`\`
\`\`\`

### Quotes and Dividers
\`\`\`
> Blockquote text

---
\`\`\`

### Tables
\`\`\`
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
\`\`\`

### Task Lists
\`\`\`
- [x] Completed task
- [ ] Incomplete task
\`\`\`
`
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showHelpRaw, setShowHelpRaw] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [addedPhotos, setAddedPhotos] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { user } = useAuthStore()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim() && !isLoading) {
      try {
        setIsLoading(true)
        const newPost = await postService.createPost({
          content,
          images: addedPhotos
        })

        onPostCreated(newPost)

        setContent('')
        setAddedPhotos([])
        setShowPreview(false)
        setIsModalOpen(false)

        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch (error) {
        console.error('Error creating post:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const uploadSingleImage = async (file: File) => {
    const data = new FormData()
    data.append('file', file)
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

    const res = await axios.post(CLOUDINARY_UPLOAD_URL, data, {
      withCredentials: false
    })

    return res.data.secure_url
  }

  const validateFiles = (files: FileList) => {
    const MAX_PHOTOS = 5
    const MAX_FILE_SIZE = 7 * 1024 * 1024

    if (files.length + addedPhotos.length > MAX_PHOTOS) {
      throw new Error(`You can only upload ${MAX_PHOTOS} photos`)
    }

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > MAX_FILE_SIZE) {
        throw new Error('File size should not exceed 7MB')
      }
      if (!files[i].type.startsWith('image/')) {
        throw new Error('Uploaded file is not an image')
      }
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setIsUploading(true)
    try {
      const files = e.target.files

      validateFiles(files)

      const compressedFiles = await Promise.all(
        Array.from(files).map(compressImage)
      )

      const urls = await Promise.all(compressedFiles.map(uploadSingleImage))

      toast({
        title: 'Photos uploaded successfully',
        description: 'You can now add more photos or submit your post'
      })
      setAddedPhotos(prev => [...prev, ...urls])
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setIsUploading(false)
    }
  }

  const removePhoto = (url: string) => {
    setAddedPhotos(prev => prev.filter(photo => photo !== url))
  }

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isModalOpen])

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setShowHelp(true) // Show help by default when opening modal
  }

  return (
    <>
      <motion.div
        onClick={handleOpenModal}
        whileHover={{ scale: 1.003 }}
        whileTap={{ scale: 0.98 }}
        className='dark:bg-primary-800   shadow-lg backdrop-blur-sm rounded-lg border border-primary-600 p-4 text-white cursor-pointer hover:border-red-500 transition-colors'
      >
        <div className='flex items-center gap-3 text-gray-700 dark:text-white'>
          <PenSquare className='w-5 h-5' />
          <SparklesText text='Create a post...' className='text-sm' />
        </div>
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title='Create Post'
        size='xl'
      >
        <div className='flex flex-col lg:flex-row gap-4 h-[70vh]'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className='flex-1 flex flex-col'
          >
            <form onSubmit={handleSubmit} className='flex-1 flex flex-col'>
              {!showPreview ? (
                <motion.textarea
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className='flex-1 p-4 bg-gray-900 border border-slate-700 rounded-lg resize-none 
                           focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                           text-white placeholder-slate-400 font-mono
                           scrollbar-thin scrollbar-thumb-red-500/50 hover:scrollbar-thumb-red-500/70
                           scrollbar-track-gray-800 scrollbar-thumb-rounded-full'
                  placeholder="What's on your mind? (Supports Markdown)"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  disabled={isLoading}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className='flex-1 p-4 bg-gray-900 border border-slate-700 rounded-lg
                            text-white prose prose-invert max-w-none overflow-y-auto
                            scrollbar-thin scrollbar-thumb-red-500/50 hover:scrollbar-thumb-red-500/70
                            scrollbar-track-gray-800 scrollbar-thumb-rounded-full'
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    className='break-words'
                  >
                    {content || '*Preview empty*'}
                  </ReactMarkdown>
                </motion.div>
              )}

              <div className='mt-4 space-y-2'>
                <div className='flex flex-wrap gap-2'>
                  {addedPhotos.map(url => (
                    <div key={url} className='relative w-24 h-24'>
                      <img
                        src={url}
                        alt='Uploaded'
                        className='w-full h-full object-cover rounded-lg'
                      />
                      <button
                        type='button'
                        onClick={() => removePhoto(url)}
                        className='absolute top-1 right-1 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors'
                      >
                        <Trash2 className='w-4 h-4 text-white' />
                      </button>
                    </div>
                  ))}
                  {addedPhotos.length < 5 && (
                    <label className='w-24 h-24 flex flex-col items-center justify-center border border-slate-700 rounded-lg cursor-pointer hover:border-red-500 transition-colors'>
                      <input
                        type='file'
                        multiple
                        className='hidden'
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        accept='image/*'
                      />
                      {isUploading ? (
                        <Loader2 className='w-6 h-6 animate-spin text-red-500' />
                      ) : (
                        <>
                          <Upload className='w-6 h-6 text-red-500' />
                          <span className='text-xs text-gray-400 mt-1'>
                            Upload
                          </span>
                        </>
                      )}
                    </label>
                  )}
                </div>
                {addedPhotos.length > 0 && (
                  <p className='text-xs text-gray-400'>
                    {addedPhotos.length}/5 photos added
                  </p>
                )}
              </div>

              <div className='flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-2 mt-4'>
                <div className='flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start'>
                  <button
                    type='button'
                    className={cn(
                      'text-white transition-colors',
                      showPreview ? 'text-blue-400' : 'hover:text-blue-400'
                    )}
                    onClick={() => setShowPreview(!showPreview)}
                    title={showPreview ? 'Show editor' : 'Show preview'}
                  >
                    {showPreview ? (
                      <EyeOff className='w-6 h-6' />
                    ) : (
                      <Eye className='w-6 h-6' />
                    )}
                  </button>
                  <button
                    type='button'
                    className={cn(
                      'text-white transition-colors',
                      showHelp ? 'text-blue-400' : 'hover:text-blue-400'
                    )}
                    onClick={() => setShowHelp(!showHelp)}
                    title='Markdown help'
                  >
                    <HelpCircle className='w-6 h-6' />
                  </button>
                </div>
                <Button
                  type='submit'
                  disabled={!content.trim() || isLoading || isUploading}
                  className='bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto'
                >
                  {isLoading ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </form>
          </motion.div>

          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, y: 20, x: 0 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: 20, x: 0 }}
                transition={{ duration: 0.3 }}
                className='w-full lg:w-96 h-[300px] lg:h-auto p-4 bg-gray-900 rounded-lg border border-slate-700 overflow-y-auto text-white
                          scrollbar-thin scrollbar-thumb-red-500/50 hover:scrollbar-thumb-red-500/70
                          scrollbar-track-gray-800 scrollbar-thumb-rounded-full'
              >
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold text-white'>
                    Markdown Guide
                  </h3>
                  <button
                    type='button'
                    className={cn(
                      'text-blue-400 transition-colors text-xs',
                      showHelpRaw ? 'text-blue-400' : 'hover:text-red-400'
                    )}
                    onClick={() => setShowHelpRaw(!showHelpRaw)}
                    title={showHelpRaw ? 'Show preview' : 'Show markdown'}
                  >
                    <div className='flex gap-2 align-middle justify-center items-center'>
                      {showHelpRaw ? 'Show preview' : 'Show markdown'}

                      <Code className='w-5 h-5 text-red-500 animate-pulse' />
                    </div>
                  </button>
                </div>
                <div className='prose prose-invert max-w-none text-sm'>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  >
                    {showHelpRaw ? markdownHelp.raw : markdownHelp.preview}
                  </ReactMarkdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Modal>
    </>
  )
}

export default CreatePost
