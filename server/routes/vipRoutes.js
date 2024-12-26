import verifyToken from '../middlewares/verifyToken.js'
import express from 'express'
import {
  buyVip,
  claimPoints,
  removeVip,
  getServices
} from '../controllers/Vip.js'

const router = express.Router()

router.put('/', verifyToken, buyVip)
router.put('/claim', verifyToken, claimPoints)
router.delete('/', verifyToken, removeVip)
router.get('/getServices', verifyToken, getServices)
export default router
