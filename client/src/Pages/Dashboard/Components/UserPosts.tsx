import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/hooks/use-toast'
import api from '@/lib/axios'
import Post from '@/Components/Post'
import { Loader2 } from 'lucide-react'
import CreatePost from '@/Components/CreatePost'
import postService, { Post as PostType } from '@/services/postService'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog"

const UserPosts = () => {
  const [posts, setPosts] = useState<PostType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)

  const fetchUserPosts = async () => {
    if (!user?._id) return

    try {
      setIsLoading(true)
      const response = await api.get(`/posts/user/${user._id}`, {
        params: {
          page,
          limit: 10
        }
      })

      if (page === 1) {
        setPosts(response.data.posts)
      } else {
        setPosts(prevPosts => [...prevPosts, ...response.data.posts])
      }
      setHasMore(response.data.currentPage < response.data.totalPages)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch your posts',
        variant: 'destructive'
      })
      setPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserPosts()
  }, [user?._id, page])

  const handlePostCreated = (newPost: PostType) => {
    setPosts(prevPosts => [newPost, ...prevPosts])
  }

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

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return

    try {
      await postService.deletePost(postToDelete)
      setPosts(posts.filter(p => p._id !== postToDelete))
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive'
      })
    } finally {
      setPostToDelete(null)
    }
  }

  if (isLoading && page === 1) {
    return (
      <div className='flex justify-center items-center min-h-[200px]'>
        <Loader2 className='w-8 h-8 animate-spin text-red-500' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <CreatePost onPostCreated={handlePostCreated} />
      {posts.length === 0 ? (
        <div className='text-center py-8 text-muted-foreground'>
          You haven't created any posts yet.
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
                //@ts-ignore
                isSaved: post.savedBy.includes(user?._id),
                isOwnPost: user ? post.author._id === user._id : false,
                images: post.images
              }}
              onDelete={() => setPostToDelete(post._id)}
              onLike={() => handlePostLiked(post._id)}
              onComment={(content) => handlePostComment(post._id, content)}
              onSave={() => handlePostSave(post._id)}
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

      <AlertDialog open={!!postToDelete} onOpenChange={() => setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default UserPosts
