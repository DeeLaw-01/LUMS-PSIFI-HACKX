import { useState, useEffect, useRef } from 'react'
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  Trash2,
  Send,
  Loader2,
  Copy,
  Check,
  Facebook,
  Twitter,
  Linkedin,
  Smartphone
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import ProfileImage from './ProfileImage'
import ImageModal from './ui/ImageModal'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import postService from '@/services/postService'
import type { Comment, Reply } from '@/services/postService'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'

interface PostAuthor {
  name: string
  title: string
  avatar?: string
}

interface PostProps {
  post: {
    id: string
    author: PostAuthor
    content: string
    timestamp: string
    likes: number
    comments: Comment[]
    isLiked: boolean
    isSaved: boolean
    isOwnPost: boolean
    images?: string[]
  }
  onLike: () => void
  onDelete: () => void
  onComment: (content: string) => void
  onSave: () => void
}

interface CommentProps {
  comment: Comment
  postId: string
  onCommentLiked: (commentId: string) => void
  onReply: (commentId: string, content: string) => void
  onReplyLiked: (commentId: string, replyId: string) => void
}

const Comment: React.FC<CommentProps> = ({
  comment,
  postId,
  onCommentLiked,
  onReply,
  onReplyLiked
}) => {
  const [showReplies, setShowReplies] = useState(false)
  const [repliesPage, setRepliesPage] = useState(1)
  const [replies, setReplies] = useState<Reply[]>([])
  const [hasMoreReplies, setHasMoreReplies] = useState(true)
  const [loadingReplies, setLoadingReplies] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [showReplyInput, setShowReplyInput] = useState(false)
  const { user } = useAuthStore()

  const fetchReplies = async (page: number) => {
    try {
      setLoadingReplies(true)
      const response = await postService.getReplies(postId, comment._id, page)
      if (page === 1) {
        setReplies(response.replies)
      } else {
        setReplies(prev => [...prev, ...response.replies])
      }
      setHasMoreReplies(page < response.totalPages)
    } catch (error) {
      console.error('Error fetching replies:', error)
    } finally {
      setLoadingReplies(false)
    }
  }

  useEffect(() => {
    if (showReplies) {
      fetchReplies(1)
    }
  }, [showReplies])

  const handleLoadMoreReplies = async () => {
    const nextPage = repliesPage + 1
    await fetchReplies(nextPage)
    setRepliesPage(nextPage)
  }

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (replyContent.trim()) {
      await onReply(comment._id, replyContent.trim())
      setReplyContent('')
      setShowReplyInput(false)
      // Refresh replies to show the new one
      setRepliesPage(1)
      fetchReplies(1)
    }
  }

  const isCommentLiked = user && comment.likes.includes(user._id)
  const isReplyLiked = (reply: Reply) => user && reply.likes.includes(user._id)

  const handleReplyLike = async (replyId: string) => {
    try {
      const updatedPost = await postService.likeReply(
        postId,
        comment._id,
        replyId
      )

      // Find the updated comment in the returned post
      const updatedComment = updatedPost.comments.find(
        c => c._id === comment._id
      )
      if (updatedComment) {
        // Update the replies state with the new data
        setReplies(prevReplies =>
          prevReplies.map(reply => {
            const updatedReply = updatedComment.replies.find(
              r => r._id === reply._id
            )
            return updatedReply || reply
          })
        )
      }

      // Call the parent handler if provided
      if (onReplyLiked) {
        onReplyLiked(comment._id, replyId)
      }
    } catch (error) {
      console.error('Error liking reply:', error)
    }
  }

  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <ProfileImage
          src={comment.author.profilePicture}
          alt={comment.author.username}
          size='sm'
        />
        <div className='flex-1 bg-primary-700 rounded-lg p-3'>
          <div className='flex justify-between items-start'>
            <span className='font-medium text-sm text-white'>
              {comment.author.username}
            </span>
            <span className='text-xs text-gray-400'>
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className='text-sm text-gray-300 mt-1'>{comment.content}</p>
          <div className='flex items-center gap-4 mt-2 text-sm'>
            <button
              onClick={() => onCommentLiked(comment._id)}
              className={cn(
                'flex items-center gap-1 transition-colors duration-200',
                isCommentLiked
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-400 hover:text-red-500'
              )}
            >
              <ThumbsUp
                className={cn(
                  'w-4 h-4',
                  isCommentLiked && 'fill-current scale-110'
                )}
              />
              <span>{comment.likes.length}</span>
            </button>
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className='text-gray-400 hover:text-blue-400 transition-colors'
            >
              Reply
            </button>
            {comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className='text-gray-400 hover:text-blue-400 transition-colors'
              >
                {showReplies
                  ? 'Hide replies'
                  : `Show replies (${comment.replies.length})`}
              </button>
            )}
          </div>
        </div>
      </div>

      {showReplyInput && (
        <form onSubmit={handleSubmitReply} className='flex gap-2 ml-8'>
          <ProfileImage
            src={user?.profilePicture}
            alt={user?.username || 'User'}
            size='sm'
          />
          <div className='flex-1 flex gap-2'>
            <input
              type='text'
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder='Write a reply...'
              className='flex-1 bg-primary-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-red-500'
            />
            <button
              type='submit'
              disabled={!replyContent.trim()}
              className='text-red-500 hover:text-red-400 disabled:text-gray-500 transition-colors'
            >
              <Send className='w-5 h-5' />
            </button>
          </div>
        </form>
      )}

      {showReplies && (
        <div className='ml-8 space-y-2'>
          {replies.map(reply => (
            <div key={reply._id} className='flex gap-2'>
              <ProfileImage
                src={reply.author.profilePicture}
                alt={reply.author.username}
                size='sm'
              />
              <div className='flex-1 bg-primary-700 rounded-lg p-3'>
                <div className='flex justify-between items-start'>
                  <span className='font-medium text-sm text-white'>
                    {reply.author.username}
                  </span>
                  <span className='text-xs text-gray-400'>
                    {new Date(reply.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className='text-sm text-gray-300 mt-1'>{reply.content}</p>
                <button
                  onClick={() => handleReplyLike(reply._id)}
                  className={cn(
                    'flex items-center gap-1 mt-2 text-sm transition-colors duration-200',
                    isReplyLiked(reply)
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-gray-400 hover:text-red-500'
                  )}
                >
                  <ThumbsUp
                    className={cn(
                      'w-4 h-4',
                      isReplyLiked(reply) && 'fill-current scale-110'
                    )}
                  />
                  <span>{reply.likes.length}</span>
                </button>
              </div>
            </div>
          ))}

          {hasMoreReplies && (
            <button
              onClick={handleLoadMoreReplies}
              disabled={loadingReplies}
              className='ml-8 text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2'
            >
              {loadingReplies ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Loading...
                </>
              ) : (
                'Load More Replies'
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

const MAX_CONTENT_HEIGHT = 300 // pixels for collapsed state

const Post = ({ post, onLike, onDelete, onComment, onSave }: PostProps) => {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isLiking, setIsLiking] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentsPage, setCommentsPage] = useState(1)
  const [hasMoreComments, setHasMoreComments] = useState(true)
  const [loadingComments, setLoadingComments] = useState(false)
  const { user } = useAuthStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [shouldShowReadMore, setShouldShowReadMore] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareUrl = `${window.location.origin}/post/${post.id}`

  useEffect(() => {
    if (contentRef.current) {
      setShouldShowReadMore(
        contentRef.current.scrollHeight > MAX_CONTENT_HEIGHT
      )
    }
  }, [post.content])

  const fetchComments = async (page: number) => {
    try {
      setLoadingComments(true)
      const response = await postService.getComments(post.id, page)
      if (page === 1) {
        setComments(response.comments)
      } else {
        setComments(prev => [...prev, ...response.comments])
      }
      setHasMoreComments(page < response.totalPages)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoadingComments(false)
    }
  }

  useEffect(() => {
    if (showComments) {
      fetchComments(1)
    }
  }, [showComments])

  const handleLoadMoreComments = () => {
    if (!loadingComments && hasMoreComments) {
      const nextPage = commentsPage + 1
      setCommentsPage(nextPage)
      fetchComments(nextPage)
    }
  }

  const handleLike = async () => {
    if (isLiking) return
    setIsLiking(true)
    await onLike()
    setIsLiking(false)
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      await onComment(newComment.trim())
      setNewComment('')
      // Refresh comments to show the new one
      setCommentsPage(1)
      fetchComments(1)
    }
  }

  const handleToggleComments = () => {
    setShowComments(!showComments)
    if (!showComments) {
      setCommentsPage(1)
    }
  }

  const handleCommentLiked = async (commentId: string) => {
    try {
      const updatedPost = await postService.likeComment(post.id, commentId)
      setComments(
        comments.map(comment =>
          comment._id === commentId
            ? updatedPost.comments.find(c => c._id === commentId)!
            : comment
        )
      )
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }

  const handleReplyToComment = async (commentId: string, content: string) => {
    try {
      const updatedPost = await postService.replyToComment(
        post.id,
        commentId,
        content
      )
      setComments(
        comments.map(comment =>
          comment._id === commentId
            ? updatedPost.comments.find(c => c._id === commentId)!
            : comment
        )
      )
    } catch (error) {
      console.error('Error replying to comment:', error)
    }
  }

  const handleReplyLiked = async (commentId: string, replyId: string) => {
    try {
      const updatedPost = await postService.likeReply(
        post.id,
        commentId,
        replyId
      )
      setComments(
        comments.map(comment =>
          comment._id === commentId
            ? updatedPost.comments.find(c => c._id === commentId)!
            : comment
        )
      )
    } catch (error) {
      console.error('Error liking reply:', error)
    }
  }

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index)
    setIsModalOpen(true)
  }

  const handleNextImage = () => {
    if (post.images && currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1)
    }
  }

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1)
    }
  }

  const handleShare = () => {
    setShareDialogOpen(true)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareToSocial = (platform: string) => {
    const text = `Check out this post: ${shareUrl}`
    let url = ''

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Check out this post!')}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(text)}`
        break
    }

    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <div
        className='dark:bg-primary-800 bg-white backdrop-blur-sm border border-primary-600 rounded-lg p-4 
                    shadow-lg transition-all duration-300 text-white'
      >
        {/* Author Section */}
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center'>
            <ProfileImage
              src={post.author.avatar}
              alt={post.author.name}
              size='md'
            />
            <div className='ml-3'>
              <h3 className='font-medium dark:text-white text-black'>
                {post.author.name}
              </h3>
              <p className='text-sm dark:text-slate-300 text-black'>
                {post.author.title} • {post.timestamp}
              </p>
            </div>
          </div>
          {post.isOwnPost && (
            <button
              onClick={onDelete}
              className='text-gray-400 hover:text-red-500 transition-colors'
            >
              <Trash2 className='w-5 h-5' />
            </button>
          )}
        </div>

        {/* Content with Markdown */}
        <div
          className={cn(
            'relative mb-4 prose prose-invert max-w-none dark:text-white text-black',
            !isExpanded && shouldShowReadMore && 'max-h-[300px] overflow-hidden'
          )}
        >
          <div ref={contentRef}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              className='text-text-primary break-words'
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-400 hover:text-blue-300 transition-colors'
                  />
                ),
                code: ({
                  node,
                  className,
                  children,
                  inline,
                  ...props
                }: any) => (
                  <code
                    {...props}
                    className={cn(
                      'bg-primary-700 rounded px-1.5 py-0.5',
                      !inline && 'block p-4 overflow-x-auto',
                      className
                    )}
                  >
                    {children}
                  </code>
                ),
                pre: ({ node, ...props }) => (
                  <pre
                    {...props}
                    className='bg-primary-700 rounded-lg p-4 overflow-x-auto'
                  />
                ),
                img: ({ node, ...props }) => (
                  <img
                    {...props}
                    className='max-w-full h-auto rounded-lg'
                    loading='lazy'
                  />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    {...props}
                    className='border-l-4 border-primary-600 pl-4 italic'
                  />
                )
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {shouldShowReadMore && !isExpanded && (
            <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-primary-800 to-transparent' />
          )}
        </div>

        {shouldShowReadMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='mb-4 text-red-500 hover:text-red-400 transition-colors text-sm font-medium'
          >
            {isExpanded ? 'Show less' : 'Read more...'}
          </button>
        )}

        {/* Images Grid - Always show below content */}
        {post.images && post.images.length > 0 && (
          <div
            className={cn(
              'grid gap-2 mb-4',
              post.images.length === 1 && 'grid-cols-1',
              post.images.length === 2 && 'grid-cols-2',
              post.images.length >= 3 && 'grid-cols-3'
            )}
          >
            {post.images.map((image, index) => (
              <div
                key={image}
                className={cn(
                  'relative rounded-lg overflow-hidden cursor-pointer',
                  post.images?.length === 1 ? 'max-h-[500px]' : 'aspect-square'
                )}
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className={cn(
                    'w-full h-full transition-transform duration-200 hover:scale-105',
                    post.images?.length === 1
                      ? 'object-contain'
                      : 'object-cover'
                  )}
                  loading='lazy'
                />
              </div>
            ))}
          </div>
        )}

        {/* Interaction Buttons */}
        <div className='flex items-center justify-between text-text-secondary'>
          <button
            className={cn(
              'flex items-center space-x-2 transition-colors duration-200',
              post.isLiked
                ? 'text-red-500  hover:text-red-600'
                : 'text-gray-400 hover:text-red-500',
              isLiking && 'opacity-50 cursor-not-allowed'
            )}
            onClick={handleLike}
            disabled={isLiking}
          >
            <ThumbsUp
              className={cn(
                'w-5 h-5',
                post.isLiked && 'fill-current scale-110'
              )}
            />
            <span>{post.likes}</span>
          </button>
          <button
            className={cn(
              'flex items-center space-x-2 transition-colors duration-200',
              showComments
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-400 hover:text-red-500'
            )}
            onClick={handleToggleComments}
          >
            <MessageCircle
              className={cn(
                'w-5 h-5 transition-all duration-200',
                showComments && 'fill-current scale-110'
              )}
            />
            <span>{post.comments.length}</span>
          </button>
          <button 
            onClick={handleShare}
            className='flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors duration-200'
          >
            <Share2 className='w-5 h-5' />
            <span>Share</span>
          </button>
          <button
            className={cn(
              'flex items-center space-x-2 transition-colors duration-200',
              post.isSaved
                ? 'text-green-500 hover:text-green-600'
                : 'text-gray-400 hover:text-green-500'
            )}
            onClick={onSave}
          >
            <Bookmark
              className={cn(
                'w-5 h-5 transition-all duration-200',
                post.isSaved && 'fill-current scale-110'
              )}
            />
            <span>{post.isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className='mt-4 pt-4 border-t border-primary-700'>
            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className='flex gap-2 mb-4'>
              <ProfileImage
                src={user?.profilePicture}
                alt={user?.username || 'User'}
                size='sm'
              />
              <div className='flex-1 flex gap-2'>
                <input
                  type='text'
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder='Write a comment...'
                  className='flex-1 bg-primary-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-red-500'
                />
                <button
                  type='submit'
                  disabled={!newComment.trim()}
                  className='text-red-500 hover:text-red-400 disabled:text-gray-500 transition-colors'
                >
                  <Send className='w-5 h-5' />
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className='space-y-4'>
              {comments.map(comment => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  postId={post.id}
                  onCommentLiked={handleCommentLiked}
                  onReply={handleReplyToComment}
                  onReplyLiked={handleReplyLiked}
                />
              ))}

              {/* Load More Comments Button */}
              {hasMoreComments && (
                <button
                  onClick={handleLoadMoreComments}
                  disabled={loadingComments}
                  className='w-full py-2 text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-2'
                >
                  {loadingComments ? (
                    <>
                      <Loader2 className='w-4 h-4 animate-spin' />
                      Loading...
                    </>
                  ) : (
                    'Load More Comments'
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Post</DialogTitle>
            <DialogDescription>
              Share this post with your network
            </DialogDescription>
          </DialogHeader>
          
          <div className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <Input 
                readOnly 
                value={shareUrl}
                className='flex-1'
              />
              <Button
                variant='outline'
                size='icon'
                onClick={copyToClipboard}
                className='shrink-0'
              >
                {copied ? (
                  <Check className='w-4 h-4 text-green-500' />
                ) : (
                  <Copy className='w-4 h-4' />
                )}
              </Button>
            </div>

            <div className='flex justify-center space-x-4'>
              <Button
                variant='outline'
                size='icon'
                onClick={() => shareToSocial('facebook')}
                className='text-blue-500 hover:text-blue-600'
              >
                <Facebook className='w-5 h-5' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={() => shareToSocial('twitter')}
                className='text-sky-500 hover:text-sky-600'
              >
                <Twitter className='w-5 h-5' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={() => shareToSocial('linkedin')}
                className='text-blue-600 hover:text-blue-700'
              >
                <Linkedin className='w-5 h-5' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={() => shareToSocial('whatsapp')}
                className='text-green-500 hover:text-green-600'
              >
                <Smartphone className='w-5 h-5' />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      {post.images && (
        <ImageModal
          images={post.images}
          currentIndex={currentImageIndex}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onNext={handleNextImage}
          onPrevious={handlePreviousImage}
        />
      )}
    </>
  )
}

export default Post
