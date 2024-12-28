import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/hooks/use-toast'
import type { Startup, Post } from '@/types/startup'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import {
  PenSquare,
  Upload,
  Loader2,
  Link as LinkIcon,
  MoreVertical,
  Pencil,
  Trash,
  Eye,
  EyeOff,
  HelpCircle
} from 'lucide-react'
import { Button } from '@/Components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/Components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/Components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu'
import { Input } from '@/Components/ui/input'
import { Textarea } from '@/Components/ui/textarea'
import { addPost, updatePost, deletePost } from '@/services/startupService'
import axios from 'axios'
import imageCompression from 'browser-image-compression'


interface PostsSectionProps {
  startup: Startup
  canCreate: boolean
  onUpdate: () => void
}

const CLOUDINARY_UPLOAD_PRESET = 'ylmqjrhi'
const CLOUDINARY_CLOUD_NAME = 'drqdsjywx'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

const PostsSection = ({ startup, canCreate, onUpdate }: PostsSectionProps) => {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    link: ''
  })
  const [showPreview, setShowPreview] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [addedPhotos, setAddedPhotos] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateFiles = (files: FileList) => {
    const maxFiles = 5 - addedPhotos.length
    if (files.length > maxFiles) {
      throw new Error(`You can only add up to ${maxFiles} more photos`)
    }

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed')
      }
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Each file must be less than 10MB')
      }
    })
  }

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    try {
      return await imageCompression(file, options)
    } catch (error) {
      console.error('Error compressing image:', error)
      return file
    }
  }

  const uploadSingleImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

    const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData)
    return response.data.secure_url
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

      setFormData(prev => ({
        ...prev,
        image: [...(prev.image ? [prev.image] : []), ...urls].join('\n')
      }))

      toast({
        title: 'Success',
        description: 'Images uploaded successfully'
      })
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
    setFormData(prev => ({
      ...prev,
      image: prev.image
        ?.split('\n')
        .filter(u => u !== url)
        .join('\n')
    }))
  }

  const handleCreatePost = async () => {
    try {
      setLoading(true)
      await addPost(startup._id, formData)
      setCreateDialogOpen(false)
      setFormData({
        title: '',
        content: '',
        image: '',
        link: ''
      })
      onUpdate()
      toast({
        title: 'Success',
        description: 'Post created successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create post',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePost = async () => {
    if (!editingPost) return

    try {
      setLoading(true)
      await updatePost(startup._id, editingPost._id, formData)
      setEditingPost(null)
      onUpdate()
      toast({
        title: 'Success',
        description: 'Post updated successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update post',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    try {
      setLoading(true)
      await deletePost(startup._id, postId)
      onUpdate()
      toast({
        title: 'Success',
        description: 'Post deleted successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete post',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const renderPostForm = () => (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Title</label>
        <Input
          name='title'
          value={formData.title}
          onChange={handleInputChange}
          placeholder='Enter post title'
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium'>Content (Supports Markdown)</label>
        {!showPreview ? (
          <Textarea
            name='content'
            value={formData.content}
            onChange={handleInputChange}
            placeholder='Write your post...'
            rows={10}
            className='font-mono'
          />
        ) : (
          <div className='p-4 border rounded-md min-h-[200px] prose prose-invert max-w-none'>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            >
              {formData.content || '*Preview empty*'}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium'>Images</label>
        <div className='flex flex-wrap gap-2'>
          {formData.image?.split('\n').filter(Boolean).map(url => (
            <div key={url} className='relative w-24 h-24'>
              <img
                src={url}
                alt='Upload'
                className='w-full h-full object-cover rounded-lg'
              />
              <button
                type='button'
                onClick={() => removePhoto(url)}
                className='absolute top-1 right-1 p-1 bg-destructive rounded-full hover:bg-destructive/90'
              >
                <Trash className='w-4 h-4 text-white' />
              </button>
            </div>
          ))}
          {(!formData.image || formData.image.split('\n').length < 5) && (
            <label className='w-24 h-24 flex flex-col items-center justify-center border rounded-lg cursor-pointer hover:border-primary'>
              <input
                type='file'
                multiple
                className='hidden'
                onChange={handleImageUpload}
                disabled={isUploading}
                accept='image/*'
              />
              {isUploading ? (
                <Loader2 className='w-6 h-6 animate-spin' />
              ) : (
                <>
                  <Upload className='w-6 h-6' />
                  <span className='text-xs mt-1'>Upload</span>
                </>
              )}
            </label>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium'>External Link</label>
        <Input
          name='link'
          value={formData.link}
          onChange={handleInputChange}
          placeholder='Add a link (optional)'
        />
      </div>

      <div className='flex items-center gap-2'>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={() => setShowHelp(!showHelp)}
        >
          <HelpCircle className='w-4 h-4' />
        </Button>
      </div>
    </div>
  )

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Posts</h2>
        {canCreate && (
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className='gap-2'>
                <PenSquare className='w-4 h-4' />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[600px]'>
              <DialogHeader>
                <DialogTitle>Create Post</DialogTitle>
                <DialogDescription>
                  Share updates about your startup
                </DialogDescription>
              </DialogHeader>
              {renderPostForm()}
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setCreateDialogOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePost}
                  disabled={loading || !formData.title || !formData.content}
                >
                  {loading ? (
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  ) : (
                    'Create Post'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Posts List */}
      <div className='space-y-6'>
        {startup.posts?.length === 0 ? (
          <Card>
            <CardContent className='p-6 text-center'>
              <p className='text-muted-foreground'>No posts yet</p>
              {canCreate && (
                <p className='text-sm text-muted-foreground mt-1'>
                  Create your first post to share updates about your startup
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          startup.posts?.map(post => (
            <Card key={post._id}>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <img
                      src={post.author.profilePicture || '/default-avatar.png'}
                      alt={post.author.username}
                      className='w-8 h-8 rounded-full'
                    />
                    <div>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription>
                        Posted by {post.author.username} on{' '}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  {(canCreate || post.author._id === user?._id) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreVertical className='w-4 h-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingPost(post)
                            setFormData({
                              title: post.title,
                              content: post.content,
                              image: post.image || '',
                              link: post.link || ''
                            })
                          }}
                        >
                          <Pencil className='w-4 h-4 mr-2' />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className='text-destructive'
                          onClick={() => handleDeletePost(post._id)}
                        >
                          <Trash className='w-4 h-4 mr-2' />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='prose prose-invert max-w-none'>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
                {post.image && post.image.split('\n').map((url, index) => (
                  url && (
                    <img
                      key={index}
                      src={url}
                      alt='Post'
                      className='rounded-md max-h-96 object-cover'
                    />
                  )
                ))}
                {post.link && (
                  <Button
                    variant='outline'
                    className='gap-2'
                    onClick={() => window.open(post.link, '_blank')}
                  >
                    <LinkIcon className='w-4 h-4' />
                    View Link
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Post Dialog */}
      <Dialog
        open={!!editingPost}
        onOpenChange={(open) => !open && setEditingPost(null)}
      >
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Update your post's content
            </DialogDescription>
          </DialogHeader>
          {renderPostForm()}
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setEditingPost(null)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdatePost}
              disabled={loading || !formData.title || !formData.content}
            >
              {loading ? (
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PostsSection 