import Startup from '../models/Startup.js'
import { createStartupProductNotification } from './notificationController.js'

// Add a product
export const addProduct = async (req, res) => {
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

    startup.products.push(req.body)
    await startup.save()

    const newProduct = startup.products[startup.products.length - 1]
    
    // Create notification for followers
    await createStartupProductNotification(
      startup._id,
      newProduct._id,
      `${startup.displayName} added a new product: ${newProduct.name}`
    )

    res.status(201).json(newProduct)
  } catch (error) {
    console.log("error at add:", error)
    res.status(500).json({ message: error.message })
  }
}

// Update a product
export const updateProduct = async (req, res) => {
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

    const productIndex = startup.products.findIndex(
      p => p._id.toString() === req.params.productId
    )
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' })
    }

    startup.products[productIndex] = {
      ...startup.products[productIndex].toObject(),
      ...req.body
    }

    await startup.save()
    res.json(startup.products[productIndex])
  } catch (error) {
    console.log("error at update", error)
    res.status(500).json({ message: error.message })
  }
}

// Delete a product
export const deleteProduct = async (req, res) => {
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

    startup.products = startup.products.filter(
      p => p._id.toString() !== req.params.productId
    )

    await startup.save()
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.log("error at delete", error)
    res.status(500).json({ message: error.message })
  }
} 