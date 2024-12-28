import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
} from '../controllers/notificationController.js'

const router = express.Router()

// Get user's notifications
router.get('/', verifyToken, getNotifications)

// Get unread count
router.get('/unread-count', verifyToken, getUnreadCount)

// Mark notification as read
router.put('/:id/read', verifyToken, markAsRead)

// Mark all notifications as read
router.put('/read-all', verifyToken, markAllAsRead)

export default router 