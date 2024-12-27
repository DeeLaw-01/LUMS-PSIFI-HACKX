import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

// Message operations
router.post('/', verifyToken, sendMessage)
router.get('/conversations', verifyToken, getConversations)
router.get('/conversation/:userId', verifyToken, getConversation)
router.delete('/message/:messageId', verifyToken, deleteMessage)
router.put('/message/:messageId/read', verifyToken, markMessageAsRead)

export default router
