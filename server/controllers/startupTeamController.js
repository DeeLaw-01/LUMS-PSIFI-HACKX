import Startup from '../models/Startup.js'
import User from '../models/User.js'
import { nanoid } from 'nanoid'

// Helper function to check if user has required role
const hasRequiredRole = (startup, userId, requiredRoles) => {
  const member = startup.team.find(m => m.user.toString() === userId.toString())
  return member && requiredRoles.includes(member.role)
}

// Request to join a startup
export const requestToJoin = async (req, res) => {
  try {
    const { startupId, message } = req.body
    const userId = req.user._id

    const startup = await Startup.findById(startupId)
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' })
    }

    // Check if user is already a member
    if (startup.team.some(m => m.user.toString() === userId.toString())) {
      return res
        .status(400)
        .json({ message: 'Already a member of this startup' })
    }

    // Check if user already has a pending request
    if (
      startup.joinRequests.some(
        r => r.user.toString() === userId.toString() && r.status === 'PENDING'
      )
    ) {
      return res.status(400).json({ message: 'Already have a pending request' })
    }

    startup.joinRequests.push({
      user: userId,
      message,
      status: 'PENDING'
    })

    await startup.save()
    res.status(200).json({ message: 'Join request sent successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Handle join request (accept/reject)
export const handleJoinRequest = async (req, res) => {
  try {
    const { startupId, userId, status, position = '' } = req.body
    const handlerId = req.user._id

    const startup = await Startup.findById(startupId)
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' })
    }

    // Check if handler has permission (must be OWNER)
    if (!hasRequiredRole(startup, handlerId, ['OWNER'])) {
      return res
        .status(403)
        .json({ message: 'Not authorized to handle join requests' })
    }

    const request = startup.joinRequests.find(
      r => r.user.toString() === userId && r.status === 'PENDING'
    )
    if (!request) {
      return res.status(404).json({ message: 'Join request not found' })
    }

    request.status = status

    if (status === 'ACCEPTED') {
      startup.team.push({
        user: userId,
        role: 'VIEWER',
        position,
        joinedAt: new Date()
      })

      // Update user's startups array
      await User.findByIdAndUpdate(userId, {
        $push: {
          startups: {
            startup: startupId,
            role: 'VIEWER',
            position,
            joinedAt: new Date()
          }
        }
      })
    }

    await startup.save()
    res
      .status(200)
      .json({ message: `Join request ${status.toLowerCase()} successfully` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create invite link
export const createInviteLink = async (req, res) => {
  try {
    const { startupId, role = 'VIEWER', expiresInDays = 7 } = req.body
    const userId = req.user._id

    const startup = await Startup.findById(startupId)
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' })
    }

    // Check if user has permission (must be OWNER)
    if (!hasRequiredRole(startup, userId, ['OWNER'])) {
      return res
        .status(403)
        .json({ message: 'Not authorized to create invite links' })
    }

    const code = nanoid(10)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    startup.inviteLinks.push({
      code,
      role,
      expiresAt,
      createdBy: userId
    })

    await startup.save()
    res.status(200).json({ code, expiresAt })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Join via invite link
export const joinViaInviteLink = async (req, res) => {
  try {
    const { startupId, inviteCode, position = '' } = req.body
    const userId = req.user._id

    const startup = await Startup.findById(startupId)
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' })
    }

    // Find and validate invite link
    const invite = startup.inviteLinks.find(i => i.code === inviteCode)
    if (!invite) {
      return res.status(404).json({ message: 'Invalid invite link' })
    }

    if (new Date() > invite.expiresAt) {
      return res.status(400).json({ message: 'Invite link has expired' })
    }

    // Check if user is already a member
    if (startup.team.some(m => m.user.toString() === userId.toString())) {
      return res
        .status(400)
        .json({ message: 'Already a member of this startup' })
    }

    // Add user to team
    startup.team.push({
      user: userId,
      role: invite.role,
      position,
      joinedAt: new Date()
    })

    // Update user's startups array
    await User.findByIdAndUpdate(userId, {
      $push: {
        startups: {
          startup: startupId,
          role: invite.role,
          position,
          joinedAt: new Date()
        }
      }
    })

    await startup.save()
    res.status(200).json({ message: 'Joined startup successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update member role
export const updateMemberRole = async (req, res) => {
  try {
    const { startupId, userId, role } = req.body
    const updaterId = req.user._id

    const startup = await Startup.findById(startupId)
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' })
    }

    // Check if updater has permission (must be OWNER)
    if (!hasRequiredRole(startup, updaterId, ['OWNER'])) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update member roles' })
    }

    // Cannot change role of another OWNER
    const targetMember = startup.team.find(
      m => m.user.toString() === userId.toString()
    )
    if (!targetMember) {
      return res.status(404).json({ message: 'Member not found' })
    }

    if (targetMember.role === 'OWNER' && role !== 'OWNER') {
      return res.status(403).json({ message: 'Cannot change role of an owner' })
    }

    // Update role in startup
    targetMember.role = role

    // Update role in user's startups array
    await User.findOneAndUpdate(
      { _id: userId, 'startups.startup': startupId },
      { $set: { 'startups.$.role': role } }
    )

    await startup.save()
    res.status(200).json({ message: 'Member role updated successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update member position
export const updateMemberPosition = async (req, res) => {
  try {
    const { startupId, userId, position } = req.body
    const updaterId = req.user._id

    const startup = await Startup.findById(startupId)
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' })
    }

    // Check if updater has permission (must be OWNER)
    if (!hasRequiredRole(startup, updaterId, ['OWNER'])) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update member positions' })
    }

    const member = startup.team.find(
      m => m.user.toString() === userId.toString()
    )
    if (!member) {
      return res.status(404).json({ message: 'Member not found' })
    }

    // Update position in startup
    member.position = position

    // Update position in user's startups array
    await User.findOneAndUpdate(
      { _id: userId, 'startups.startup': startupId },
      { $set: { 'startups.$.position': position } }
    )

    await startup.save()
    res.status(200).json({ message: 'Member position updated successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Remove member
export const removeMember = async (req, res) => {
  try {
    const { startupId, userId } = req.body
    const removerId = req.user._id

    const startup = await Startup.findById(startupId)
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' })
    }

    // Check if remover has permission (must be OWNER)
    if (!hasRequiredRole(startup, removerId, ['OWNER'])) {
      return res
        .status(403)
        .json({ message: 'Not authorized to remove members' })
    }

    const memberToRemove = startup.team.find(
      m => m.user.toString() === userId.toString()
    )
    if (!memberToRemove) {
      return res.status(404).json({ message: 'Member not found' })
    }

    // Cannot remove an OWNER
    if (memberToRemove.role === 'OWNER') {
      return res.status(403).json({ message: 'Cannot remove an owner' })
    }

    // Remove from startup team
    startup.team = startup.team.filter(
      m => m.user.toString() !== userId.toString()
    )

    // Remove from user's startups array
    await User.findByIdAndUpdate(userId, {
      $pull: { startups: { startup: startupId } }
    })

    await startup.save()
    res.status(200).json({ message: 'Member removed successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get team members
export const getTeamMembers = async (req, res) => {
  try {
    const { startupId } = req.params
    const userId = req.user._id

    const startup = await Startup.findById(startupId).populate(
      'team.user',
      'username email profilePicture'
    )
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' })
    }

    // Check if user is a member
    if (!startup.team.some(m => m.user._id.toString() === userId.toString())) {
      return res
        .status(403)
        .json({ message: 'Not authorized to view team members' })
    }

    res.status(200).json(startup.team)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get join requests
export const getJoinRequests = async (req, res) => {
  try {
    const { startupId } = req.params
    const userId = req.user._id

    const startup = await Startup.findById(startupId).populate(
      'joinRequests.user',
      'username email profilePicture'
    )
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' })
    }

    // Check if user has permission (must be OWNER)
    if (!hasRequiredRole(startup, userId, ['OWNER'])) {
      return res
        .status(403)
        .json({ message: 'Not authorized to view join requests' })
    }

    res.status(200).json(startup.joinRequests)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
