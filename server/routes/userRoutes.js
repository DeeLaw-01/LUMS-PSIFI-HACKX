import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import { updateUser, getUserPosts } from '../controllers/userController.js'

const router = express.Router()

// User routes
router.put('/update', verifyToken, updateUser)
router.get('/:id/posts', verifyToken, getUserPosts)

export default router
