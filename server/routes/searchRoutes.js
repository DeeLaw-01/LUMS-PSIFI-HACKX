import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

// Search operations
router.get('/users', searchUsers)
router.get('/posts', searchPosts)
router.get('/messages', verifyToken, searchMessages)
router.get('/trending', getTrendingTopics)

export default router
