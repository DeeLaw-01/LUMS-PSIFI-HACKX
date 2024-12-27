import React, { useState } from 'react'
import {
  ImageIcon,
  Eye,
  EyeOff,
  HelpCircle,
  PenSquare,
  Code
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
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
  const { user } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim() && !isLoading) {
      try {
        setIsLoading(true)
        const newPost = await postService.createPost({ content })

        onPostCreated(newPost)

        setContent('')
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
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className='bg-primary-800 backdrop-blur-sm rounded-lg border border-primary-600 p-4 text-white cursor-pointer hover:border-red-500 transition-colors'
      >
        <div className='flex items-center gap-3 text-gray-400'>
          <PenSquare className='w-5 h-5' />
          <span>Create a post...</span>
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
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-400 hover:text-blue-300 transition-colors'
                        />
                      ),
                      code: ({ node, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '')
                        return (
                          <code
                            {...props}
                            className={cn(
                              'bg-primary-700 rounded px-1.5 py-0.5',
                              !props.inline &&
                                'block p-4 overflow-x-auto font-base',
                              className
                            )}
                          >
                            {children}
                          </code>
                        )
                      },
                      pre: ({ node, ...props }) => (
                        <pre
                          {...props}
                          className='bg-primary-700 rounded-lg p-4 overflow-x-auto'
                        />
                      ),
                      img: ({ node, ...props }) => (
                        <img
                          {...props}
                          className='max-w-full h-auto rounded-lg'
                          loading='lazy'
                        />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          {...props}
                          className='border-l-4 border-primary-600 pl-4 italic'
                        />
                      )
                    }}
                  >
                    {content || '*Preview empty*'}
                  </ReactMarkdown>
                </motion.div>
              )}

              <div className='flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-2 mt-4'>
                <div className='flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start'>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className='text-white hover:text-red-400 transition-colors'
                    disabled={isLoading}
                  >
                    <ImageIcon className='w-6 h-6' />
                  </motion.button>
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
                  disabled={!content.trim() || isLoading}
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
                      'text-white transition-colors',
                      showHelpRaw ? 'text-red-400' : 'hover:text-red-400'
                    )}
                    onClick={() => setShowHelpRaw(!showHelpRaw)}
                    title={showHelpRaw ? 'Show preview' : 'Show markdown'}
                  >
                    <Code className='w-5 h-5 text-red-500 animate-pulse' />
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
