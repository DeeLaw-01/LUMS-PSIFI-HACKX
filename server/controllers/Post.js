import Post from '../models/Post.js'

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { content, images, tags } = req.body
    const newPost = new Post({
      author: req.user.id,
      content,
      images: images || [],
      tags: tags || []
    })

    const savedPost = await newPost.save()
    // Populate author details
    await savedPost.populate([
      { path: 'author', select: 'username profilePicture' },
      { path: 'likes', select: 'username' },
      { path: 'comments.author', select: 'username profilePicture' }
    ])

    res.status(201).json(savedPost)
  } catch (error) {
    console.error('Create post error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Get all posts (with pagination)
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Get paginated posts
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username profilePicture')
      .populate('likes', 'username')
      .populate('comments.author', 'username profilePicture')
      .populate('savedBy', 'username')

    // Get total count of posts
    const total = await Post.countDocuments()

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    })
  } catch (error) {
    console.error('Get posts error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Get a single post by ID
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username profilePicture')
      .populate('likes', 'username')
      .populate('comments.author', 'username profilePicture')
      .populate('savedBy', 'username')

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    res.json(post)
  } catch (error) {
    console.error('Get post error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Update a post
export const updatePost = async (req, res) => {
  try {
    const { content, images, tags } = req.body
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this post' })
    }

    post.content = content || post.content
    post.images = images || post.images
    post.tags = tags || post.tags

    const updatedPost = await post.save()
    await updatedPost.populate([
      { path: 'author', select: 'username profilePicture' },
      { path: 'likes', select: 'username' },
      { path: 'comments.author', select: 'username profilePicture' },
      { path: 'savedBy', select: 'username' }
    ])

    res.json(updatedPost)
  } catch (error) {
    console.error('Update post error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this post' })
    }

    await post.deleteOne()
    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Delete post error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Like/Unlike a post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const likeIndex = post.likes.indexOf(req.user.id)

    if (likeIndex === -1) {
      // Like the post
      post.likes.push(req.user.id)
    } else {
      // Unlike the post
      post.likes.splice(likeIndex, 1)
    }

    const updatedPost = await post.save()
    await updatedPost.populate([
      { path: 'author', select: 'username profilePicture' },
      { path: 'likes', select: 'username' },
      { path: 'comments.author', select: 'username profilePicture' },
      { path: 'savedBy', select: 'username' }
    ])

    res.json(updatedPost)
  } catch (error) {
    console.error('Like post error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Add a comment to a post
export const commentPost = async (req, res) => {
  try {
    const { content } = req.body
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    post.comments.push({
      author: req.user.id,
      content
    })

    const updatedPost = await post.save()
    await updatedPost.populate([
      { path: 'author', select: 'username profilePicture' },
      { path: 'likes', select: 'username' },
      { path: 'comments.author', select: 'username profilePicture' },
      { path: 'savedBy', select: 'username' }
    ])

    res.json(updatedPost)
  } catch (error) {
    console.error('Comment post error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Save/Unsave a post
export const savePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const saveIndex = post.savedBy.indexOf(req.user.id)

    if (saveIndex === -1) {
      // Save the post
      post.savedBy.push(req.user.id)
    } else {
      // Unsave the post
      post.savedBy.splice(saveIndex, 1)
    }

    const updatedPost = await post.save()
    await updatedPost.populate([
      { path: 'author', select: 'username profilePicture' },
      { path: 'likes', select: 'username' },
      { path: 'comments.author', select: 'username profilePicture' },
      { path: 'savedBy', select: 'username' }
    ])

    res.json(updatedPost)
  } catch (error) {
    console.error('Save post error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Get saved posts
export const getSavedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const posts = await Post.find({ savedBy: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username profilePicture')
      .populate('likes', 'username')
      .populate('comments.author', 'username profilePicture')
      .populate('savedBy', 'username')

    const total = await Post.countDocuments({ savedBy: req.user.id })

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    })
  } catch (error) {
    console.error('Get saved posts error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Get comments for a post
export const getComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // Calculate pagination
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const totalComments = post.comments.length

    // Sort comments by date (newest first) and slice for pagination
    const paginatedComments = post.comments
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(startIndex, endIndex)

    // Populate author details for the paginated comments
    await Post.populate(paginatedComments, {
      path: 'author',
      select: 'username profilePicture'
    })

    res.json({
      comments: paginatedComments,
      currentPage: page,
      totalPages: Math.ceil(totalComments / limit),
      totalComments
    })
  } catch (error) {
    console.error('Get comments error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Like/Unlike a comment
export const likeComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const comment = post.comments.id(req.params.commentId)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    const likeIndex = comment.likes.indexOf(req.user.id)
    if (likeIndex === -1) {
      // Like the comment
      comment.likes.push(req.user.id)
    } else {
      // Unlike the comment
      comment.likes.splice(likeIndex, 1)
    }

    const updatedPost = await post.save()
    await updatedPost.populate([
      { path: 'author', select: 'username profilePicture' },
      { path: 'comments.author', select: 'username profilePicture' },
      { path: 'comments.likes', select: 'username' },
      { path: 'comments.replies.author', select: 'username profilePicture' },
      { path: 'comments.replies.likes', select: 'username' }
    ])

    res.json(updatedPost)
  } catch (error) {
    console.error('Like comment error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Add a reply to a comment
export const replyToComment = async (req, res) => {
  try {
    const { content } = req.body
    const post = await Post.findById(req.params.postId)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const comment = post.comments.id(req.params.commentId)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    comment.replies.push({
      author: req.user.id,
      content,
      likes: []
    })

    const updatedPost = await post.save()
    await updatedPost.populate([
      { path: 'author', select: 'username profilePicture' },
      { path: 'comments.author', select: 'username profilePicture' },
      { path: 'comments.likes', select: 'username' },
      { path: 'comments.replies.author', select: 'username profilePicture' },
      { path: 'comments.replies.likes', select: 'username' }
    ])

    res.json(updatedPost)
  } catch (error) {
    console.error('Reply to comment error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Like/Unlike a reply
export const likeReply = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const comment = post.comments.id(req.params.commentId)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    const reply = comment.replies.id(req.params.replyId)
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' })
    }

    const likeIndex = reply.likes.indexOf(req.user.id)
    if (likeIndex === -1) {
      // Like the reply
      reply.likes.push(req.user.id)
    } else {
      // Unlike the reply
      reply.likes.splice(likeIndex, 1)
    }

    const updatedPost = await post.save()
    await updatedPost.populate([
      { path: 'author', select: 'username profilePicture' },
      { path: 'comments.author', select: 'username profilePicture' },
      { path: 'comments.likes', select: 'username' },
      { path: 'comments.replies.author', select: 'username profilePicture' },
      { path: 'comments.replies.likes', select: 'username' }
    ])

    res.json(updatedPost)
  } catch (error) {
    console.error('Like reply error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Get replies for a comment with pagination
export const getReplies = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const comment = post.comments.id(req.params.commentId)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    // Get total count of replies
    const totalReplies = comment.replies.length

    // Get paginated replies
    const paginatedReplies = comment.replies
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(startIndex, endIndex)

    // Populate author details for the paginated replies
    await Post.populate(paginatedReplies, [
      { path: 'author', select: 'username profilePicture' },
      { path: 'likes', select: 'username' }
    ])

    res.json({
      replies: paginatedReplies,
      currentPage: page,
      totalPages: Math.ceil(totalReplies / limit),
      totalReplies
    })
  } catch (error) {
    console.error('Get replies error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Get posts by user ID
export const getPostsByUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const userId = req.params.id

    // Get paginated posts for specific user
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username profilePicture')
      .populate('likes', 'username')
      .populate('comments.author', 'username profilePicture')
      .populate('savedBy', 'username')

    // Get total count of user's posts
    const total = await Post.countDocuments({ author: userId })

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    })
  } catch (error) {
    console.error('Get posts by user error:', error)
    res.status(500).json({ message: error.message })
  }
}
