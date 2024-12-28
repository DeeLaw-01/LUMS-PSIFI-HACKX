import express from 'express'
import { search, quickSearch } from '../controllers/searchController.js'
import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

router.get('/', verifyToken, search)
router.get('/quick', verifyToken, quickSearch)

export default router
