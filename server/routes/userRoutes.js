import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import { updateUser, getUserPosts, getRecentUsers, getUserProfile, getUserStartups } from '../controllers/userController.js'

const router = express.Router()

// User routes
router.put('/update', verifyToken, updateUser)
router.get('/:id/posts', verifyToken, getUserPosts)
router.get('/recent', verifyToken, getRecentUsers)
router.get('/:id/profile', verifyToken, getUserProfile)
router.get('/:userId/startups', verifyToken, getUserStartups)

export default router
