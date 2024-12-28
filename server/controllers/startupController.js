import Startup from '../models/Startup.js'
import User from '../models/User.js'
import mongoose from 'mongoose'

// Create a new startup
export const createStartup = async (req, res) => {
  try {
    const startupData = {
      ...req.body,
      team: [
        {
          user: req.user.id,
          role: 'OWNER',
          position: 'Founder',
          joinedAt: new Date()
        }
      ]
    }

    const startup = await Startup.create(startupData)
    
    // Add startup to user's startups array
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        startups: {
          startup: startup._id,
          role: 'OWNER',
          position: 'Founder',
          joinedAt: new Date()
        }
      }
    })

    await startup.populate('team.user', 'username email profilePicture')

    res.status(201).json(startup)
  } catch (error) {
    console.error('Create startup error:', error)
    res.status(400).json({
      message: 'Failed to create startup',
      error: error.message
    })
  }
}

// Get startup by ID
export const getStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id)
      .populate('team.user', 'username email profilePicture')
      .populate('posts.author', 'username profilePicture')
      .populate('joinRequests.user', 'username email profilePicture')
      .populate('inviteLinks.createdBy', 'username')

    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' })
    }

    res.status(200).json(startup)
  } catch (error) {
    console.error('Get startup error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Update startup
export const updateStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id)
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' })
    }

    // Check if user is an owner
    const isOwner = startup.team.some(
      member => 
        member.user.toString() === req.user.id && 
        member.role === 'OWNER'
    )

    if (!isOwner) {
      return res.status(403).json({ message: 'Not authorized - must be an owner' })
    }

    const updatedStartup = await Startup.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('team.user', 'username email profilePicture')
      .populate('posts.author', 'username profilePicture')
      .populate('joinRequests.user', 'username email profilePicture')

    res.json(updatedStartup)
  } catch (error) {
    console.error('Update startup error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Delete startup
export const deleteStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id)
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' })
    }

    // Check if user is an owner
    const userStartup = await User.findOne({
      _id: req.user.id,
      'startups.startup': startup._id,
      'startups.role': 'OWNER'
    })

    if (!userStartup) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    // Remove startup from all users' startups array
    await User.updateMany(
      { 'startups.startup': startup._id },
      { $pull: { startups: { startup: startup._id } } }
    )

    // Delete the startup
    await Startup.findByIdAndDelete(req.params.id)

    res.json({ message: 'Startup deleted successfully' })
  } catch (error) {
    console.error('Delete startup error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get user's startups
export const getUserStartups = async (req, res) => {
  try {
    // If a userId is provided in params, use that, otherwise use the authenticated user's id
    const userId = req.params.userId || req.user.id;

    const startups = await Startup.find({
      'team.user': userId
    }).populate('team.user', 'username email profilePicture');

    res.json(startups);
  } catch (error) {
    console.error('Get user startups error:', error);
    res.status(500).json({ message: 'Failed to fetch startups' });
  }
}

// Request to join startup
export const requestToJoin = async (req, res) => {
  try {
    const { startupId, position } = req.body

    const startup = await Startup.findById(startupId)
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' })
    }

    // Check if user is already a member
    const isMember = await User.findOne({
      _id: req.user.id,
      'startups.startup': startupId
    })

    if (isMember) {
      return res.status(400).json({ message: 'Already a member' })
    }

    // Add user to startup with VIEWER role (pending approval)
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        startups: {
          startup: startupId,
          role: 'VIEWER',
          position: position || '',
          joinedAt: new Date()
        }
      }
    })

    res.json({ message: 'Join request sent successfully' })
  } catch (error) {
    console.error('Request to join error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Update member role
export const updateMemberRole = async (req, res) => {
  try {
    const { startupId, userId, role } = req.body

    // Check if the requesting user is an owner
    const requestingUser = await User.findOne({
      _id: req.user.id,
      'startups.startup': startupId,
      'startups.role': 'OWNER'
    })

    if (!requestingUser) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    // Update the member's role
    await User.findOneAndUpdate(
      {
        _id: userId,
        'startups.startup': startupId
      },
      {
        $set: {
          'startups.$.role': role
        }
      }
    )

    res.json({ message: 'Member role updated successfully' })
  } catch (error) {
    console.error('Update member role error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Remove member from startup
export const removeMember = async (req, res) => {
  try {
    const { startupId, userId } = req.body

    // Check if the requesting user is an owner
    const requestingUser = await User.findOne({
      _id: req.user.id,
      'startups.startup': startupId,
      'startups.role': 'OWNER'
    })

    if (!requestingUser) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    // Check if target user is also an owner
    const targetUser = await User.findOne({
      _id: userId,
      'startups.startup': startupId,
      'startups.role': 'OWNER'
    })

    if (targetUser) {
      return res.status(403).json({ message: 'Cannot remove an owner' })
    }

    // Remove the member from the startup
    await User.findByIdAndUpdate(userId, {
      $pull: {
        startups: { startup: startupId }
      }
    })

    res.json({ message: 'Member removed successfully' })
  } catch (error) {
    console.error('Remove member error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
