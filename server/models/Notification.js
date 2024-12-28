import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['STARTUP_POST', 'STARTUP_PRODUCT', 'STARTUP_PROJECT', 'STARTUP_UPDATE', 'STARTUP_FOLLOW', 'STARTUP_TIMELINE'],
      required: true
    },
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Startup',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  { timestamps: true }
)

// Index to improve query performance
NotificationSchema.index({ recipient: 1, createdAt: -1 })
NotificationSchema.index({ recipient: 1, read: 1 })

const Notification = mongoose.model('Notification', NotificationSchema)
export default Notification 