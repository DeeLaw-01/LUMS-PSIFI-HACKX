import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import verifyAdmin from '../middlewares/verifyAdmin.js'
import {
  getStats,
  getTransactionsByDate,
  getTransactionsSummary
} from '../controllers/Stats.js'

const router = express.Router()

router.get('/', verifyToken, verifyAdmin, getStats)
router.get('/transactions', verifyToken, verifyAdmin, getTransactionsByDate)
router.get(
  '/transactions/summary',
  verifyToken,
  verifyAdmin,
  getTransactionsSummary
)

export default router
