import mongoose from 'mongoose'

const StartupSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      default: ''
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
        type: [Number],
        required: true
      }
    },
    team: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        role: {
          type: String,
          enum: ['OWNER', 'EDITOR', 'VIEWER'],
          default: 'VIEWER'
        },
        position: {
          type: String,
          default: ''
        },
        joinedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    joinRequests: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        message: {
          type: String,
          maxLength: 500
        },
        status: {
          type: String,
          enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
          default: 'PENDING'
        },
        requestedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    inviteLinks: [
      {
        code: {
          type: String,
          default: undefined
        },
        role: {
          type: String,
          enum: ['EDITOR', 'VIEWER'],
          default: 'VIEWER'
        },
        expiresAt: Date,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      }
    ]
  },
  { timestamps: true }
)

// Remove duplicate index creation
StartupSchema.index(
  { 'inviteLinks.code': 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: {
      'inviteLinks.code': { $exists: true, $ne: null }
    }
  }
)

// Keep the geospatial index
StartupSchema.index({ location: '2dsphere' })

const Startup = mongoose.model('Startup', StartupSchema)
export default Startup
