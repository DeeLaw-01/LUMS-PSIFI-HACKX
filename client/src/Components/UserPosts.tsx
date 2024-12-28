import { useState, useEffect } from 'react'
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
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { toast } = useToast()
  const { user } = useAuthStore()

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await postService.getUserPosts(userId, page)
      if (page === 1) {
        setPosts(response.posts)
      } else {
        setPosts(prev => [...prev, ...response.posts])
      }
      setHasMore(page < response.totalPages)
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

  useEffect(() => {
    setPage(1)
    setPosts([])
    fetchPosts()
  }, [userId])

  useEffect(() => {
    fetchPosts()
  }, [page])

  const handlePostLiked = async (postId: string) => {
    try {
      const updatedPost = await postService.likePost(postId)
      setPosts(prevPosts =>
        prevPosts.map(post => (post._id === postId ? updatedPost : post))
      )
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to like post',
        variant: 'destructive'
      })
    }
  }

  const handlePostComment = async (postId: string, content: string) => {
    try {
      const updatedPost = await postService.commentPost(postId, content)
      setPosts(prevPosts =>
        prevPosts.map(post => (post._id === postId ? updatedPost : post))
      )
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive'
      })
    }
  }

  const handlePostSave = async (postId: string) => {
    try {
      const updatedPost = await postService.savePost(postId)
      setPosts(prevPosts =>
        prevPosts.map(post => (post._id === postId ? updatedPost : post))
      )
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save post',
        variant: 'destructive'
      })
    }
  }

  const handlePostDeleted = async (postId: string) => {
    try {
      await postService.deletePost(postId)
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId))
      toast({
        title: 'Success',
        description: 'Post deleted successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive'
      })
    }
  }

  if (loading && page === 1) {
    return (
      <div className='flex justify-center p-8'>
        <Loader2 className='w-6 h-6 animate-spin text-red-500' />
      </div>
    )
  }

  if (posts.length === 0 && !loading) {
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

      {hasMore && !loading && (
        <button
          onClick={() => setPage(p => p + 1)}
          className='w-full py-2 text-red-500 hover:text-red-600 transition-colors'
        >
          Load More
        </button>
      )}

      {loading && page > 1 && (
        <div className='flex justify-center py-4'>
          <Loader2 className='w-6 h-6 animate-spin text-red-500' />
        </div>
      )}
    </div>
  )
}

export default UserPosts 