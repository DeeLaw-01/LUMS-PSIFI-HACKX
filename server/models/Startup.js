import mongoose from 'mongoose'

const StartupSchema = new mongoose.Schema(
  {
    logo: {
      type: String, // Cloudinary URL
      default: '' // You might want to set a default logo
    },
    displayName: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      maxLength: 1000
    },
    industry: {
      type: String,
      enum: ['SERVICE_BASED', 'PRODUCT_BASED', 'HYBRID'],
      required: true
    },
    fundraised: {
      type: Number,
      default: 0,
      min: 0
    },
    timelineStatus: {
      type: String,
      enum: ['IDEATION', 'MVP', 'EARLY_TRACTION', 'SCALING', 'ESTABLISHED'],
      default: 'IDEATION'
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    team: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
)

// Create a geospatial index for location queries
StartupSchema.index({ location: '2dsphere' })

const Startup = mongoose.model('Startup', StartupSchema)
export default Startup
