import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import Post from '@/Components/Post'
import postService, { Post as PostType } from '@/services/postService'
import { useAuthStore } from '@/store/useAuthStore'

const SinglePostPage = () => {
  const { id } = useParams()
  const [post, setPost] = useState<PostType | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    if (!id) return
    try {
      setLoading(true)
      const data = await postService.getPost(id)
      setPost(data)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load post',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePostLiked = async () => {
    if (!post) return
    try {
      const updatedPost = await postService.likePost(post._id)
      setPost(updatedPost)
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handlePostComment = async (content: string) => {
    if (!post) return
    try {
      const updatedPost = await postService.commentPost(post._id, content)
      setPost(updatedPost)
    } catch (error) {
      console.error('Error commenting on post:', error)
    }
  }

  const handlePostSave = async () => {
    if (!post) return
    try {
      const updatedPost = await postService.savePost(post._id)
      setPost(updatedPost)
    } catch (error) {
      console.error('Error saving post:', error)
    }
  }

  const handlePostDeleted = async () => {
    if (!post) return
    try {
      await postService.deletePost(post._id)
      window.location.href = '/' // Redirect to home after deletion
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  if (loading) {
    return (
      <div className='container max-w-4xl mx-auto py-8'>
        <div className='flex justify-center items-center min-h-[400px]'>
          <Loader2 className='w-8 h-8 animate-spin text-red-500' />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className='container max-w-4xl mx-auto py-8'>
        <div className='text-center text-gray-500'>
          Post not found
        </div>
      </div>
    )
  }

  return (
    <div className='container max-w-4xl mx-auto py-8'>
      <Post
        post={{
          id: post._id,
          author: {
            name: post.author.username,
            title: 'Member',
            avatar: post.author.profilePicture
          },
          content: post.content,
          timestamp: new Date(post.createdAt).toLocaleDateString(),
          likes: post.likes.length,
          comments: post.comments,
          isLiked: post.likes.includes(user?._id),
          isSaved: post.savedBy.includes(user?._id),
          isOwnPost: user ? post.author._id === user._id : false,
          images: post.images
        }}
        onLike={handlePostLiked}
        onComment={handlePostComment}
        onSave={handlePostSave}
        onDelete={handlePostDeleted}
      />
    </div>
  )
}

export default SinglePostPage 