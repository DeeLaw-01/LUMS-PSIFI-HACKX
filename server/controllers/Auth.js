import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { OAuth2Client } from 'google-auth-library'

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword
    })

    await user.save()

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    })

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      },
      token
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'User does not exist' })
    }

    // Check if it's a Google account
    if (user.password.startsWith('eyJ')) {
      return res.status(401).json({ message: 'Please use Google login' })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    })

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      },
      token
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const verifyGoogleToken = async (req, res) => {
  try {
    const { email, username, profilePicture } = req.body

    // Find or create user
    let user = await User.findOne({ email })
    if (!user) {
      // Create new user with Google data
      user = new User({
        email,
        username,
        password: jwt.sign({ google: true }, process.env.JWT_SECRET), // placeholder password
        profilePicture
      })
      await user.save()
    }

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    })

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      },
      token
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' })
  }
}
