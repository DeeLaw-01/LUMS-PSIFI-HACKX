import User from '../models/User.js'
import Startup from '../models/Startup.js'

export const search = async (req, res) => {
  try {
    const { query } = req.query
    if (!query) {
      return res.json({ users: [], startups: [] })
    }

    // Create case-insensitive regex for the search query
    const searchRegex = new RegExp(query, 'i')

    // Run both queries in parallel for better performance
    const [users, startups] = await Promise.all([
      // Search users by username or name, limit to 5 results
      User.find({
        $or: [
          { username: searchRegex },
          { name: searchRegex }
        ]
      })
        .select('username name profilePicture')
        .limit(5),

      // Search startups by displayName or description, limit to 5 results
      Startup.find({
        $or: [
          { displayName: searchRegex },
          { description: searchRegex }
        ]
      })
        .select('displayName description logo')
        .limit(5)
    ])

    res.json({
      users: users.map(user => ({
        _id: user._id,
        username: user.username,
        name: user.name,
        profilePicture: user.profilePicture,
        type: 'user'
      })),
      startups: startups.map(startup => ({
        _id: startup._id,
        name: startup.displayName,
        description: startup.description?.substring(0, 100),
        logo: startup.logo,
        type: 'startup'
      }))
    })
  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Typeahead search for quick suggestions
export const quickSearch = async (req, res) => {
  try {
    const { query } = req.query
    if (!query) {
      return res.json({ results: [] })
    }

    const searchRegex = new RegExp(query, 'i')

    // Run both queries in parallel and combine results
    const [users, startups] = await Promise.all([
      User.find({
        $or: [
          { username: searchRegex },
          { name: searchRegex }
        ]
      })
        .select('username name profilePicture')
        .limit(3),

      Startup.find({
        $or: [
          { displayName: searchRegex },
          { description: searchRegex }
        ]
      })
        .select('displayName description logo')
        .limit(3)
    ])

    // Combine and format results
    const results = [
      ...users.map(user => ({
        _id: user._id,
        title: user.username,
        subtitle: user.name,
        image: user.profilePicture,
        type: 'user'
      })),
      ...startups.map(startup => ({
        _id: startup._id,
        title: startup.displayName,
        subtitle: startup.description?.substring(0, 100) || 'No description',
        image: startup.logo,
        type: 'startup'
      }))
    ]

    res.json({ results })
  } catch (error) {
    console.error('Quick search error:', error)
    res.status(500).json({ message: error.message })
  }
} 