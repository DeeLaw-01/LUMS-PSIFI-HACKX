import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect
} from 'react'
import Post from './Post'
import postService, { Post as PostType } from '../services/postService'
import { useAuthStore } from '../store/useAuthStore'
import CreatePost from './CreatePost'

export interface FeedRef {
  refreshFeed: () => void
}

const Feed = forwardRef<FeedRef>((props, ref) => {
  const [posts, setPosts] = useState<PostType[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const POSTS_PER_PAGE = 10
  const { user } = useAuthStore()

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await postService.getPosts(page, POSTS_PER_PAGE)
      setPosts(prevPosts =>
        page === 1 ? response.posts : [...prevPosts, ...response.posts]
      )
      setHasMore(response.totalPosts > page * POSTS_PER_PAGE)
      console.log(response)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [page])

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1)
    }
  }

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

  const isPostLiked = (post: PostType): boolean => {
    if (!user || !user._id) return false
    console.log('post liked?: ', user._id)
    //@ts-ignore
    return post.likes.some(like => like.id === user._id)
  }

  const isPostSaved = (post: PostType): boolean => {
    if (!user || !user._id) return false
    return post.savedBy.includes(user._id)
  }

  return (
    <div className='space-y-4'>
      <CreatePost onPostCreated={handlePostCreated} />

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
            isLiked: isPostLiked(post),
            isSaved: isPostSaved(post),
            isOwnPost: user ? post.author._id === user._id : false,
            images: post.images
          }}
          onLike={() => handlePostLiked(post._id)}
          onComment={content => handlePostComment(post._id, content)}
          onSave={() => handlePostSave(post._id)}
          onDelete={() => handlePostDeleted(post._id)}
        />
      ))}
      {loading && <div className='text-center text-gray-400'>Loading...</div>}
      {!loading && hasMore && (
        <button
          onClick={handleLoadMore}
          className='w-full py-2 text-blue-400 hover:text-blue-300 transition-colors'
        >
          Load More
        </button>
      )}
    </div>
  )
})

export default Feed
