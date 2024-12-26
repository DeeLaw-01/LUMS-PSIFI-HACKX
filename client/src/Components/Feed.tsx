import { useState } from 'react'
import Post from './Post'

interface Post {
  id: number
  author: {
    name: string
    title: string
    avatar?: string
  }
  content: string
  timestamp: string
  likes: number
  comments: number
}

const Feed = () => {
  const [posts] = useState<Post[]>([
    {
      id: 1,
      author: {
        name: 'John Doe',
        title: 'Founder at TechStartup',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
      },
      content: 'Excited to announce our latest funding round! 🚀',
      timestamp: '2h',
      likes: 42,
      comments: 12
    }
    // Add more posts...
  ])

  return (
    <div className='space-y-4'>
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}

export default Feed
