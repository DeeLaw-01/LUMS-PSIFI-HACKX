import { useState, useEffect } from 'react'
import { getUserPosts } from '@/services/userService'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { Card } from '@/Components/ui/card'
import Post from '@/Components/Post'
import { useAuthStore } from '@/store/useAuthStore'
import postService, { Post as PostType } from '@/services/postService'

interface UserPostsProps {
  userId: string
}

const UserPosts = ({ userId }: UserPostsProps) => {
  const [posts, setPosts] = useState<PostType[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchPosts()
  }, [userId])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await getUserPosts(userId)
      setPosts(data)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load posts',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePostLiked = async (postId: string) => {
    try {
      const updatedPost = await postService.likePost(postId)
      setPosts(prevPosts =>
        prevPosts.map(post => (post._id === postId ? updatedPost : post))
      )
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handlePostComment = async (postId: string, content: string) => {
    try {
      const updatedPost = await postService.commentPost(postId, content)
      setPosts(prevPosts =>
        prevPosts.map(post => (post._id === postId ? updatedPost : post))
      )
    } catch (error) {
      console.error('Error commenting on post:', error)
    }
  }

  const handlePostSave = async (postId: string) => {
    try {
      const updatedPost = await postService.savePost(postId)
      setPosts(prevPosts =>
        prevPosts.map(post => (post._id === postId ? updatedPost : post))
      )
    } catch (error) {
      console.error('Error saving post:', error)
    }
  }

  const handlePostDeleted = async (postId: string) => {
    try {
      await postService.deletePost(postId)
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId))
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center p-8'>
        <Loader2 className='w-6 h-6 animate-spin' />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <Card className='p-8 text-center text-muted-foreground'>
        No posts yet
      </Card>
    )
  }

  return (
    <div className='space-y-4'>
      {posts.map((post: PostType) => (
        <Post
          key={post._id}
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
          onLike={() => handlePostLiked(post._id)}
          onComment={(content) => handlePostComment(post._id, content)}
          onSave={() => handlePostSave(post._id)}
          onDelete={() => handlePostDeleted(post._id)}
        />
      ))}
    </div>
  )
}

export default UserPosts 