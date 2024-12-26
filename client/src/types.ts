export interface IUser {
  id: string
  username: string
  email: string
  bio?: string
  startup?: {
    id: string
    name: string
    position: string
  }
}

export interface IPost {
  id: number
  author: string
  content: string
  likes: number
  comments: number
}
