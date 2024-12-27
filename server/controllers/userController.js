import User from '../models/User.js'
import bcrypt from 'bcryptjs'

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
    const posts = await Post.find({ author: req.user.id }).sort({
      createdAt: -1
    })
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}
