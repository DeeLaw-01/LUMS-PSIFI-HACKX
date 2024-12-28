import Startup from '../models/Startup.js'

// Add a project
export const addProject = async (req, res) => {
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

    // Format the data before saving
    const projectData = {
      name: req.body.name,
      description: req.body.description,
      image: req.body.image || '',
      clientName: req.body.clientName || '',
      completionDate: req.body.completionDate ? new Date(req.body.completionDate) : null,
      testimonial: req.body.testimonial || '',
      projectUrl: req.body.projectUrl || '',
      createdAt: new Date()
    }

    startup.projects.push(projectData)
    await startup.save()

    // Return the newly created project
    const newProject = startup.projects[startup.projects.length - 1]
    res.status(201).json(newProject)
  } catch (error) {
    console.error('Add project error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Update a project
export const updateProject = async (req, res) => {
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

    const projectIndex = startup.projects.findIndex(
      p => p._id.toString() === req.params.projectId
    )
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' })
    }

    // Format the update data
    const updateData = {
      ...startup.projects[projectIndex].toObject(),
      name: req.body.name || startup.projects[projectIndex].name,
      description: req.body.description || startup.projects[projectIndex].description,
      image: req.body.image || startup.projects[projectIndex].image,
      clientName: req.body.clientName || startup.projects[projectIndex].clientName,
      completionDate: req.body.completionDate ? new Date(req.body.completionDate) : startup.projects[projectIndex].completionDate,
      testimonial: req.body.testimonial || startup.projects[projectIndex].testimonial,
      projectUrl: req.body.projectUrl || startup.projects[projectIndex].projectUrl
    }

    startup.projects[projectIndex] = updateData
    await startup.save()

    res.json(startup.projects[projectIndex])
  } catch (error) {
    console.error('Update project error:', error)
    res.status(500).json({ message: error.message })
  }
}

// Delete a project
export const deleteProject = async (req, res) => {
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

    startup.projects = startup.projects.filter(
      p => p._id.toString() !== req.params.projectId
    )

    await startup.save()
    res.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Delete project error:', error)
    res.status(500).json({ message: error.message })
  }
} 