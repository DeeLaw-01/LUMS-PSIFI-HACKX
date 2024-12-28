import Startup from '../models/Startup.js'
import { createStartupPostNotification } from './notificationController.js'

// Add a post
export const addPost = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.startupId)
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' })
    }

    // Check if user has permission (must be OWNER or EDITOR)
    const member = startup.team.find(
      m => m.user.toString() === req.user.id.toString()
    )
    if (!member || !['OWNER', 'EDITOR'].includes(member.role)) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const post = {
      ...req.body,
      author: req.user.id,
      createdAt: new Date()
    }

    startup.posts.unshift(post) // Add to beginning of array
    await startup.save()
    
    // Populate the author details before sending response
    const populatedStartup = await Startup.findById(startup._id)
      .populate('posts.author', 'username profilePicture')

    const newPost = populatedStartup.posts[0]

    // Create notification for followers
    await createStartupPostNotification(
      startup._id,
      newPost._id,
      `${startup.displayName} published a new post: ${newPost.title}`
    )

    res.status(201).json(newPost)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update a post
export const updatePost = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.startupId)
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' })
    }

    const post = startup.posts.id(req.params.postId)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // Check if user is the author or has permission
    const member = startup.team.find(
      m => m.user.toString() === req.user.id.toString()
    )
    if (
      post.author.toString() !== req.user.id &&
      (!member || !['OWNER', 'EDITOR'].includes(member.role))
    ) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    Object.assign(post, req.body)
    await startup.save()

    const populatedStartup = await Startup.findById(startup._id)
      .populate('posts.author', 'username profilePicture')

    const updatedPost = populatedStartup.posts.id(post._id)
    res.json(updatedPost)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.startupId)
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' })
    }

    const post = startup.posts.id(req.params.postId)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // Check if user is the author or has permission
    const member = startup.team.find(
      m => m.user.toString() === req.user.id.toString()
    )
    if (
      post.author.toString() !== req.user.id &&
      (!member || !['OWNER', 'EDITOR'].includes(member.role))
    ) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    startup.posts = startup.posts.filter(
      p => p._id.toString() !== req.params.postId
    )
    await startup.save()

    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
} 