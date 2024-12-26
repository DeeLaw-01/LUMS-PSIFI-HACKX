import { ThumbsUp, MessageCircle, Share2, Bookmark } from 'lucide-react'

interface PostAuthor {
  name: string
  title: string
  avatar?: string
}

interface PostProps {
  post: {
    id: number
    author: PostAuthor
    content: string
    timestamp: string
    likes: number
    comments: number
  }
}

const Post = ({ post }: PostProps) => {
  return (
    <div
      className='bg-primary-800 backdrop-blur-sm border border-primary-600 rounded-lg p-4 
                    shadow-lg  transition-all duration-300'
    >
      {/* Author Section */}
      <div className='flex items-center mb-4'>
        {post.author.avatar ? (
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className='w-12 h-12 rounded-full border border-primary-500'
          />
        ) : (
          <div className='w-12 h-12 rounded-full bg-primary-700 flex items-center justify-center'>
            <span className='text-lg text-gray-300'>
              {post.author.name.charAt(0)}
            </span>
          </div>
        )}
        <div className='ml-3'>
          <h3 className='font-medium text-text-primary'>{post.author.name}</h3>
          <p className='text-sm text-text-secondary'>
            {post.author.title} • {post.timestamp}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className='mb-4'>
        <p className='text-text-primary'>{post.content}</p>
      </div>

      {/* Interaction Buttons */}
      <div className='flex items-center justify-between text-text-secondary'>
        <button className='flex items-center space-x-2 hover:text-red-500 transition-colors'>
          <ThumbsUp className='w-5 h-5' />
          <span>{post.likes}</span>
        </button>
        <button className='flex items-center space-x-2 hover:text-red-500 transition-colors'>
          <MessageCircle className='w-5 h-5' />
          <span>{post.comments}</span>
        </button>
        <button className='flex items-center space-x-2 hover:text-red-500 transition-colors'>
          <Share2 className='w-5 h-5' />
          <span>Share</span>
        </button>
        <button className='flex items-center space-x-2 hover:text-red-500 transition-colors'>
          <Bookmark className='w-5 h-5' />
          <span>Save</span>
        </button>
      </div>
    </div>
  )
}

export default Post
