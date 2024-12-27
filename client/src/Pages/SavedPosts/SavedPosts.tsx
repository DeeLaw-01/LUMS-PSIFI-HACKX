import React, { useState, useEffect } from 'react'
import Post from '@/Components/Post'
import postService, { Post as PostType } from '@/services/postService'
import { useAuthStore } from '@/store/useAuthStore'
import { Loader2 } from 'lucide-react'

const SavedPosts = () => {
  const [posts, setPosts] = useState<PostType[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const POSTS_PER_PAGE = 10
  const { user } = useAuthStore()

  const fetchSavedPosts = async () => {
    try {
      setLoading(true)
      const response = await postService.getSavedPosts(page, POSTS_PER_PAGE)
      setPosts(prevPosts =>
        page === 1 ? response.posts : [...prevPosts, ...response.posts]
      )
      setHasMore(response.totalPosts > page * POSTS_PER_PAGE)
    } catch (error) {
      console.error('Error fetching saved posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSavedPosts()
  }, [page])

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1)
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
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId))
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
    return post.likes.includes(user._id)
  }

  const isPostSaved = (post: PostType): boolean => {
    if (!user || !user._id) return false
    return post.savedBy.includes(user._id)
  }

  return (
    <div className='max-w-3xl mx-auto px-4 pt-20 min-h-screen'>
      <h1 className='text-2xl font-bold text-white mb-6'>Saved Posts</h1>
      <div className='space-y-4'>
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
              isOwnPost: user ? post.author._id === user._id : false
            }}
            onLike={() => handlePostLiked(post._id)}
            onComment={content => handlePostComment(post._id, content)}
            onSave={() => handlePostSave(post._id)}
            onDelete={() => handlePostDeleted(post._id)}
          />
        ))}

        {loading && (
          <div className='flex justify-center py-4'>
            <Loader2 className='w-6 h-6 animate-spin text-red-500' />
          </div>
        )}

        {!loading && hasMore && (
          <button
            onClick={handleLoadMore}
            className='w-full py-2 text-blue-400 hover:text-blue-300 transition-colors'
          >
            Load More
          </button>
        )}

        {!loading && posts.length === 0 && (
          <div className='text-center py-8 text-gray-400'>
            <p>No saved posts yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedPosts
