import Startup from '../models/Startup.js'

// Get timeline events
export const getTimelineEvents = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.startupId)
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' })
    }

    // Sort events by date in descending order
    const events = startup.timeline.sort((a, b) => b.date - a.date)
    res.json(events)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Add timeline event
export const addTimelineEvent = async (req, res) => {
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

    startup.timeline.push({
      ...req.body,
      date: new Date(req.body.date)
    })
    await startup.save()

    const newEvent = startup.timeline[startup.timeline.length - 1]
    res.status(201).json(newEvent)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update timeline event
export const updateTimelineEvent = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.startupId)
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' })
    }

    // Check if user has permission
    const member = startup.team.find(
      m => m.user.toString() === req.user.id.toString()
    )
    if (!member || !['OWNER', 'EDITOR'].includes(member.role)) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const event = startup.timeline.id(req.params.eventId)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    Object.assign(event, {
      ...req.body,
      date: new Date(req.body.date)
    })
    await startup.save()

    res.json(event)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete timeline event
export const deleteTimelineEvent = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.startupId)
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' })
    }

    // Check if user has permission
    const member = startup.team.find(
      m => m.user.toString() === req.user.id.toString()
    )
    if (!member || !['OWNER', 'EDITOR'].includes(member.role)) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    startup.timeline = startup.timeline.filter(
      event => event._id.toString() !== req.params.eventId
    )
    await startup.save()

    res.json({ message: 'Timeline event deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
} 