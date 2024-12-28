import express from 'express'
import { login, register, verifyGoogleToken, loginAnonymous } from '../controllers/Auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/google/verify', verifyGoogleToken)
router.post('/anonymous', loginAnonymous)

export default router
