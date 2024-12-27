import { useState, useEffect } from 'react'
import { getUserPosts } from '@/services/userService'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface Post {
  _id: string
  title: string
  content: string
  createdAt: string
}

interface PaginatedResponse {
  posts: Post[]
  currentPage: number
  totalPages: number
  totalPosts: number
}

const UserPosts = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { user } = useAuthStore()
  const { toast } = useToast()
  const POSTS_PER_PAGE = 10

  const fetchUserPosts = async () => {
    if (!user?._id) {
      setIsLoading(false)
      return
    }

    try {
      const data = (await getUserPosts(user._id)) as PaginatedResponse
      setPosts(prevPosts =>
        page === 1 ? data.posts : [...prevPosts, ...data.posts]
      )
      setHasMore(data.totalPosts > page * POSTS_PER_PAGE)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch posts',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserPosts()
  }, [page])

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  if (isLoading) {
    return (
      <div className='flex justify-center py-4'>
        <Loader2 className='w-6 h-6 animate-spin text-red-500' />
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {posts.map(post => (
        <div
          key={post._id}
          className='bg-slate-800 p-4 rounded-lg border border-slate-700'
        >
          <h3 className='text-xl font-semibold text-slate-200'>{post.title}</h3>
          <p className='text-slate-400 mt-2'>{post.content}</p>
          <div className='text-sm text-slate-500 mt-2'>
            Posted on: {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}

      {!isLoading && hasMore && (
        <button
          onClick={handleLoadMore}
          className='w-full py-2 text-blue-400 hover:text-blue-300 transition-colors'
        >
          Load More
        </button>
      )}

      {!isLoading && posts.length === 0 && (
        <div className='text-center py-8 text-gray-400'>
          <p>No posts yet.</p>
        </div>
      )}
    </div>
  )
}

export default UserPosts
