import Notification from '../models/Notification.js'
import Startup from '../models/Startup.js'
import logger from '../utils/logger.js'

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate('startup', 'displayName logo')
      .lean()

    res.json(notifications)
  } catch (error) {
    logger.error('Error getting notifications:', error)
    res.status(500).json({ message: 'Failed to get notifications' })
  }
}

export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true })
    res.json({ message: 'Notification marked as read' })
  } catch (error) {
    logger.error('Error marking notification as read:', error)
    res.status(500).json({ message: 'Failed to mark notification as read' })
  }
}

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    )
    res.json({ message: 'All notifications marked as read' })
  } catch (error) {
    logger.error('Error marking all notifications as read:', error)
    res.status(500).json({ message: 'Failed to mark all notifications as read' })
  }
}

export const followStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id)
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' })
    }

    const isFollowing = startup.followers.some(
      follower => follower.user.toString() === req.user._id.toString()
    )

    if (isFollowing) {
      // Unfollow
      startup.followers = startup.followers.filter(
        follower => follower.user.toString() !== req.user._id.toString()
      )
      await startup.save()
      return res.json({ following: false, message: 'Startup unfollowed successfully' })
    } else {
      // Follow
      startup.followers.push({ user: req.user._id })
      await startup.save()

      // Create notification for the follow action
      await Notification.create({
        recipient: req.user._id,
        type: 'STARTUP_FOLLOW',
        startup: startup._id,
        content: `You are now following ${startup.displayName}`,
        read: false,
        relatedId: startup._id
      })

      return res.json({ following: true, message: 'Startup followed successfully' })
    }
  } catch (error) {
    logger.error('Error following/unfollowing startup:', error)
    res.status(500).json({ message: 'Failed to follow/unfollow startup' })
  }
}

export const createStartupPostNotification = async (startupId, postId, content) => {
  try {
    const startup = await Startup.findById(startupId)
    if (!startup || !startup.followers.length) return

    const notifications = startup.followers.map(follower => ({
      recipient: follower.user,
      type: 'STARTUP_POST',
      startup: startupId,
      content,
      relatedId: postId,
      read: false
    }))

    await Notification.insertMany(notifications)
  } catch (error) {
    logger.error('Error creating startup post notifications:', error)
  }
} 