import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'

export const loginAnonymous = async (req, res) => {
  try {
    // Generate a random username and email with nanoid
    const randomId = nanoid(8)
    const username = `guest_${randomId}`
    const email = `anonymous_${randomId}@temp.com`

    // Create new anonymous user with random email
    const user = new User({
      username,
      email, // Add random email for anonymous users
      isAnonymous: true,
      settings: {
        emailNotifications: false,
        darkMode: true
      },
      permissions: {
        canComment: false,
        canMessage: false,
        canCreateStartup: false,
        canFollowStartup: false,
        canJoinStartup: false,
        canLike: true,
        canSave: true
      }
    })

    await user.save()

    // Create token that expires in 24 hours
    const token = jwt.sign(
      { 
        id: user._id,
        isAnonymous: true,
        anonymousId: user.anonymousId
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    )

    res.status(201).json({
      user: {
        _id: user._id,
        username: user.username,
        isAnonymous: true,
        anonymousId: user.anonymousId,
        settings: user.settings,
        permissions: user.permissions
      },
      token,
      isNewUser: false
    })
  } catch (error) {
    console.error('Anonymous login error:', error)
    res.status(500).json({ 
      message: 'Failed to create anonymous user',
      error: error.message 
    })
  }
}

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
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        startups: user.startups
      },
      token,
      isNewUser: true
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
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        startups: user.startups
      },
      token,
      isNewUser: false
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
    let isNewUser = false

    if (!user) {
      isNewUser = true
      // Create new user with Google data
      user = new User({
        email,
        username,
        password: jwt.sign({ google: true }, process.env.JWT_SECRET), // placeholder password
        profilePicture: profilePicture?.replace('=s96-c', '=s400-c') // Get larger image
      })
      await user.save()
    } else {
      // Update existing user's profile picture if it's from Google
      if (
        profilePicture &&
        (!user.profilePicture ||
          user.profilePicture.includes('googleusercontent.com'))
      ) {
        user.profilePicture = profilePicture.replace('=s96-c', '=s400-c')
        await user.save()
      }
    }

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    })

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        startups: user.startups
      },
      token,
      isNewUser
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' })
  }
}

export default { register, login, verifyGoogleToken, loginAnonymous }
