import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { ThumbsUp, MessageSquare, Share2, Bookmark } from 'lucide-react'

const posts = [
  {
    id: 1,
    author: 'Jane Doe',
    authorRole: 'Founder at TechStart',
    content: 'Excited to announce that TechStart has raised $5M in seed funding! 🚀 #startup #funding',
    likes: 120,
    comments: 25,
    timestamp: '2h ago'
  },
  {
    id: 2,
    author: 'John Smith',
    authorRole: 'CTO at InnovateCo',
    content: 'Just launched our beta product. Looking for early adopters to provide feedback. DM if interested! #betalaunch #feedback',
    likes: 89,
    comments: 14,
    timestamp: '5h ago'
  }
]

export default function Feed() {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="bg-slate-800 text-slate-200">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Image
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${post.author}`}
                alt={post.author}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h3 className="font-semibold text-blue-400">{post.author}</h3>
                <p className="text-sm text-slate-400">{post.authorRole}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-base">{post.content}</p>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="flex space-x-2 md:space-x-4">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-400 px-1 md:px-3">
                <ThumbsUp className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">{post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-400 px-1 md:px-3">
                <MessageSquare className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">{post.comments}</span>
              </Button>
            </div>
            <div className="flex space-x-2 md:space-x-4">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-400 px-1 md:px-3">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-400 px-1 md:px-3">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

