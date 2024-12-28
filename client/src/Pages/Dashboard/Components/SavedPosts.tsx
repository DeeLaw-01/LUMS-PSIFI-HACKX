import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/hooks/use-toast'
import api from '@/lib/axios'
import Post from '@/Components/Post'
import { Loader2 } from 'lucide-react'
import { Post as PostType } from '@/services/postService'

const SavedPosts = () => {
  const [posts, setPosts] = useState<PostType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchSavedPosts = async () => {
    if (!user?._id) return

    try {
      setIsLoading(true)
      const response = await api.get(`/posts/saved`, {
        params: {
          page,
          limit: 10
        }
      })

      if (page === 1) {
        setPosts(response.data.posts)
      } else {
        setPosts(prev => [...prev, ...response.data.posts])
      }
      setHasMore(response.data.currentPage < response.data.totalPages)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch saved posts',
        variant: 'destructive'
      })
      setPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSavedPosts()
  }, [user?._id, page])

  if (isLoading && page === 1) {
    return (
      <div className='flex justify-center items-center min-h-[200px]'>
        <Loader2 className='w-8 h-8 animate-spin text-red-500' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {posts.length === 0 ? (
        <div className='text-center py-8 text-muted-foreground'>
          You haven't saved any posts yet.
        </div>
      ) : (
        <>
          {posts.map(post => (
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
                //@ts-ignore
                isLiked: post.likes.includes(user?._id),
                isSaved: true, // These are saved posts
                isOwnPost: user ? post.author._id === user._id : false,
                images: post.images
              }}
              onDelete={() => {
                setPosts(posts.filter(p => p._id !== post._id))
              }}
              onLike={() => {}}
              onComment={() => {}}
              onSave={async () => {
                try {
                  await api.post(`/posts/${post._id}/unsave`)
                  setPosts(posts.filter(p => p._id !== post._id))
                  toast({
                    title: 'Success',
                    description: 'Post removed from saved posts'
                  })
                } catch (error) {
                  toast({
                    title: 'Error',
                    description: 'Failed to remove post from saved posts',
                    variant: 'destructive'
                  })
                }
              }}
            />
          ))}
          {hasMore && (
            <button
              onClick={() => setPage(p => p + 1)}
              className='w-full py-2 text-red-500 hover:text-red-600'
            >
              Load More
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default SavedPosts
