import { checkExpiry } from '../controllers/Vip.js'
import { resetClaims } from '../controllers/Workflow.js'
import verifyToken from '../middlewares/verifyToken.js'
import express from 'express'

const router = express.Router()

router.post('/reset/claims', resetClaims)
router.post('/expiry', checkExpiry)

export default router
