import express from 'express'
import { login, register } from '../controllers/Auth.js'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
)

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    try {
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      })

      // Redirect to frontend with token
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`)
    } catch (error) {
      res.redirect(
        `${process.env.CLIENT_URL}/login?error=Authentication failed`
      )
    }
  }
)

// Logout route
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' })
    }
    res.redirect(process.env.CLIENT_URL)
  })
})

export default router
