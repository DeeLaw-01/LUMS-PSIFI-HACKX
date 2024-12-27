import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import {
  createPost,
  getPost,
  getPosts,
  updatePost,
  deletePost,
  likePost,
  commentPost,
  savePost,
  getSavedPosts,
  getComments,
  likeComment,
  replyToComment,
  likeReply,
  getReplies
} from '../controllers/Post.js'

const router = express.Router()

// Post CRUD operations
router.post('/', verifyToken, createPost)
router.get('/', getPosts)
router.get('/saved', verifyToken, getSavedPosts)
router.get('/:id', getPost)
router.get('/:id/comments', getComments)
router.put('/:id', verifyToken, updatePost)
router.delete('/:id', verifyToken, deletePost)

// Post interactions
router.post('/:id/like', verifyToken, likePost)
router.post('/:id/comment', verifyToken, commentPost)
router.post('/:id/save', verifyToken, savePost)

// Comment interactions
router.post('/:postId/comments/:commentId/like', verifyToken, likeComment)
router.post('/:postId/comments/:commentId/reply', verifyToken, replyToComment)
router.get('/:postId/comments/:commentId/replies', getReplies)
router.post(
  '/:postId/comments/:commentId/replies/:replyId/like',
  verifyToken,
  likeReply
)

export default router
