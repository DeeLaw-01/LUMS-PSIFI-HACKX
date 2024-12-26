import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactions,
  getTransactionsByUser,
  totalTransactionsByDate,
  totalTransactionsByDateByUser,
  updateTransaction
} from '../controllers/Transaction.js'
import verifyToken from '../middlewares/verifyToken.js'
import express from 'express'

const router = express.Router()

router.post('/', verifyToken, createTransaction)
router.get('/', verifyToken, getTransactions)
router.get('/:id', verifyToken, getTransactionById)
router.get('/user/:userId', verifyToken, getTransactionsByUser)
router.delete('/:id', verifyToken, deleteTransaction)
router.put('/:id', verifyToken, updateTransaction)
router.get('/group/date', totalTransactionsByDate)
router.get('/group/date/:id', verifyToken, totalTransactionsByDateByUser)

export default router
