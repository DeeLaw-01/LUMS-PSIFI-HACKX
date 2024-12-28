import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect
} from 'react'
import Post from './Post'
import postService, { Post as PostType } from '../services/postService'
import startupService from '../services/startupService'
import { useAuthStore } from '../store/useAuthStore'
import CreatePost from './CreatePost'
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { Building2, Newspaper } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export interface FeedRef {
  refreshFeed: () => void
}

type FeedType = 'posts' | 'startup'

interface StartupContent {
  _id: string
  title: string
  content: string
  image?: string
  link?: string
  type: 'post' | 'product' | 'timeline'
  startup: {
    _id: string
    displayName: string
    logo: string
  }
  author?: {
    _id: string
    username: string
    profilePicture?: string
  }
  createdAt: string
}

const Feed = forwardRef<FeedRef>((props, ref) => {
  const [feedType, setFeedType] = useState<FeedType>('posts')
  const [posts, setPosts] = useState<PostType[]>([])
  const [startupContent, setStartupContent] = useState<StartupContent[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const ITEMS_PER_PAGE = 10
  const { user } = useAuthStore()
  const { toast } = useToast()

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await postService.getPosts(page, ITEMS_PER_PAGE)
      setPosts(prevPosts =>
        page === 1 ? response.posts : [...prevPosts, ...response.posts]
      )
      setHasMore(response.totalPosts > page * ITEMS_PER_PAGE)
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch posts',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStartupContent = async () => {
    try {
      setLoading(true);
      const response = await startupService.getStartupNews(page, ITEMS_PER_PAGE);
      setStartupContent(prevContent =>
        page === 1 ? response.content : [...prevContent, ...response.content]
      );
      setHasMore(response.totalItems > page * ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching startup news:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch startup news',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1)
    setHasMore(true)
    if (feedType === 'posts') {
      fetchPosts()
    } else {
      fetchStartupContent()
    }
  }, [feedType])

  useEffect(() => {
    if (feedType === 'posts') {
      fetchPosts()
    } else {
      fetchStartupContent()
    }
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
    return post.likes.some(like => like === user._id)
  }

  const isPostSaved = (post: PostType): boolean => {
    if (!user || !user._id) return false
    return post.savedBy.includes(user._id)
  }

  const renderStartupContent = (content: StartupContent) => {
    const getContentIcon = () => {
      switch (content.type) {
        case 'product':
          return '🚀'
        case 'timeline':
          return '📅'
        default:
          return '📢'
      }
    }

    return (
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-center space-x-4">
          {content.startup.logo ? (
            <img
              src={content.startup.logo}
              alt={content.startup.displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <Building2 className="w-10 h-10 text-muted-foreground" />
          )}
          <div>
            <h3 className="font-semibold">{content.startup.displayName}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="mr-2">{getContentIcon()}</span>
              <span className="capitalize">{content.type}</span>
              <span className="mx-2">•</span>
              <span>{new Date(content.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold">{content.title}</h2>
        <p className="text-muted-foreground">{content.content}</p>

        {content.image && (
          <img
            src={content.image}
            alt={content.title}
            className="rounded-lg w-full object-cover max-h-96"
          />
        )}

        {content.link && (
          <a
            href={content.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Learn More →
          </a>
        )}
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <Tabs
        defaultValue="posts"
        value={feedType}
        onValueChange={(value) => setFeedType(value as FeedType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <Newspaper className="w-4 h-4" />
            Recent Posts
          </TabsTrigger>
          <TabsTrigger value="startup" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Startup News
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {feedType === 'posts' && <CreatePost onPostCreated={handlePostCreated} />}

      <div className="space-y-4">
        {feedType === 'posts' ? (
          posts.map(post => (
            <Post
              key={post._id}
              post={{
                id: post._id,
                author: {
                  name: post.author?.username || 'Unknown User',
                  title: 'Member',
                  avatar: post.author?.profilePicture
                },
                content: post.content,
                timestamp: new Date(post.createdAt).toLocaleDateString(),
                likes: post.likes.length,
                comments: post.comments,
                isLiked: isPostLiked(post),
                isSaved: isPostSaved(post),
                isOwnPost: user ? post.author?._id === user._id : false,
                images: post.images
              }}
              onLike={() => handlePostLiked(post._id)}
              onComment={content => handlePostComment(post._id, content)}
              onSave={() => handlePostSave(post._id)}
              onDelete={() => handlePostDeleted(post._id)}
            />
          ))
        ) : (
          startupContent.map(content => (
            <div key={`${content.type}-${content._id}`}>
              {renderStartupContent(content)}
            </div>
          ))
        )}
      </div>

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
