import User from '../models/User.js'
import Post from '../models/Post.js'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

export const updateUser = async (req, res) => {
  try {
    const {
      username,
      email,
      bio,
      location,
      website,
      settings,
      currentPassword,
      newPassword,
      profilePicture
    } = req.body
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: 'Current password is incorrect' })
      }
      if (newPassword) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)
      }
    }

    // Update basic fields if provided
    if (username) user.username = username
    if (email) user.email = email
    if (bio !== undefined) user.bio = bio
    if (location !== undefined) user.location = location
    if (website !== undefined) user.website = website
    if (profilePicture !== undefined) user.profilePicture = profilePicture

    // Update settings if provided
    if (settings) {
      user.settings = {
        ...user.settings,
        ...settings
      }
    }

    await user.save()

    // Remove sensitive information before sending response
    const userResponse = user.toObject()
    delete userResponse.password

    res.json(userResponse)
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('author', 'username profilePicture')
      .populate('likes', 'username')
      .populate('comments.author', 'username profilePicture')
      .exec()

    res.json(posts)
  } catch (error) {
    console.error('Get user posts error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Get recent users
export const getRecentUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5
    const users = await User
      .find({ _id: { $ne: req.user.id } })
      .select('username profilePicture bio role')
      .sort({ createdAt: -1 })
      .limit(limit)

    res.json(users)
  } catch (error) {
    console.log(users)
    res.status(500).json({ message: error.message })
  }
}

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -settings -email')
      .populate({
        path: 'startups.startup',
        select: 'displayName logo description industry timelineStatus'
      })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error('Get user profile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getUserStartups = async (req, res) => {
  try {
    // If no userId in params, use the authenticated user's id
    const userId = req.params.userId || req.user.id

    const user = await User.findById(new mongoose.Types.ObjectId(userId))
      .populate({
        path: 'startups.startup',
        populate: {
          path: 'team.user',
          select: 'username email profilePicture'
        }
      })
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const startups = user.startups.map(s => s.startup)
    res.json(startups)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Failed to fetch startups' })
  }
}
