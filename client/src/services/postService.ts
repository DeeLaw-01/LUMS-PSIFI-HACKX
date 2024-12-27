import api from '../lib/axios'

export interface Reply {
  _id: string
  author: {
    _id: string
    username: string
    profilePicture?: string
  }
  content: string
  likes: string[]
  createdAt: string
}

export interface Comment {
  _id: string
  author: {
    _id: string
    username: string
    profilePicture?: string
  }
  content: string
  likes: string[]
  replies: Reply[]
  createdAt: string
}

export interface Post {
  _id: string
  author: {
    _id: string
    username: string
    profilePicture?: string
  }
  content: string
  images: string[]
  likes: string[]
  comments: Comment[]
  savedBy: string[]
  createdAt: string
  updatedAt: string
}

interface CreatePostData {
  content: string
  images?: string[]
}

interface PostsResponse {
  posts: Post[]
  currentPage: number
  totalPages: number
  totalPosts: number
}

interface CommentsResponse {
  comments: Comment[]
  currentPage: number
  totalPages: number
  totalComments: number
}

interface RepliesResponse {
  replies: Reply[]
  currentPage: number
  totalPages: number
  totalReplies: number
}

const postService = {
  createPost: async (postData: CreatePostData): Promise<Post> => {
    const response = await api.post('/posts', postData)
    return response.data
  },

  getPosts: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PostsResponse> => {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`)
    return response.data
  },

  getSavedPosts: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PostsResponse> => {
    const response = await api.get(`/posts/saved?page=${page}&limit=${limit}`)
    return response.data
  },

  likePost: async (postId: string): Promise<Post> => {
    const response = await api.post(`/posts/${postId}/like`)
    return response.data
  },

  commentPost: async (postId: string, content: string): Promise<Post> => {
    const response = await api.post(`/posts/${postId}/comment`, { content })
    return response.data
  },

  savePost: async (postId: string): Promise<Post> => {
    const response = await api.post(`/posts/${postId}/save`)
    return response.data
  },

  deletePost: async (postId: string): Promise<void> => {
    await api.delete(`/posts/${postId}`)
  },

  getComments: async (
    postId: string,
    page: number = 1,
    limit: number = 5
  ): Promise<CommentsResponse> => {
    const response = await api.get(
      `/posts/${postId}/comments?page=${page}&limit=${limit}`
    )
    return response.data
  },

  likeComment: async (postId: string, commentId: string): Promise<Post> => {
    const response = await api.post(
      `/posts/${postId}/comments/${commentId}/like`
    )
    return response.data
  },

  replyToComment: async (
    postId: string,
    commentId: string,
    content: string
  ): Promise<Post> => {
    const response = await api.post(
      `/posts/${postId}/comments/${commentId}/reply`,
      { content }
    )
    return response.data
  },

  likeReply: async (
    postId: string,
    commentId: string,
    replyId: string
  ): Promise<Post> => {
    const response = await api.post(
      `/posts/${postId}/comments/${commentId}/replies/${replyId}/like`
    )
    return response.data
  },

  getReplies: async (
    postId: string,
    commentId: string,
    page: number = 1,
    limit: number = 5
  ): Promise<RepliesResponse> => {
    const response = await api.get(
      `/posts/${postId}/comments/${commentId}/replies?page=${page}&limit=${limit}`
    )
    return response.data
  }
}

export default postService
