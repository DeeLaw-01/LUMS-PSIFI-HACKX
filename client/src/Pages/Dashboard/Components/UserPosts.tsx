import { useState, useEffect } from 'react'
import { getUserPosts } from '@/services/userService'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/hooks/use-toast'

interface Post {
  _id: string
  title: string
  content: string
  createdAt: string
}

const UserPosts = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, token } = useAuthStore()
  const { toast } = useToast()

  useEffect(() => {
    fetchUserPosts()
  }, [])

  const fetchUserPosts = async () => {
    try {
      const data = await getUserPosts(user?._id)
      setPosts(data)
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

  if (isLoading) {
    return <div className="text-slate-200">Loading...</div>
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div 
          key={post._id} 
          className="bg-slate-800 p-4 rounded-lg border border-slate-700"
        >
          <h3 className="text-xl font-semibold text-slate-200">{post.title}</h3>
          <p className="text-slate-400 mt-2">{post.content}</p>
          <div className="text-sm text-slate-500 mt-2">
            Posted on: {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )
}

export default UserPosts 