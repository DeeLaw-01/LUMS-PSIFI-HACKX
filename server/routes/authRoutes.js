import express from 'express'
import { login, register, verifyGoogleToken } from '../controllers/Auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/google/verify', verifyGoogleToken)

export default router
