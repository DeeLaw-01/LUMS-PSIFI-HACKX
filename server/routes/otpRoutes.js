import express from 'express'
import { checkUserOtp, regenerateToken, verifyOtpEndpoint } from '../controllers/Otp.js'

const router = express.Router()

router.post('/validate', checkUserOtp);
router.post('/verify', verifyOtpEndpoint);
router.post('/regenerate', regenerateToken);

export default router
