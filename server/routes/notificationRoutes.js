import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import {
  getNotifications,
  markAsRead,
  markAllAsRead
} from '../controllers/notificationController.js'

const router = express.Router()

// Get user's notifications
router.get('/', verifyToken, getNotifications)

// Mark notification as read
router.put('/:id/read', verifyToken, markAsRead)

// Mark all notifications as read
router.put('/read-all', verifyToken, markAllAsRead)

export default router 