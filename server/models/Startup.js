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
          required: false,
          sparse: true
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
    ],
    products: [{
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      image: String,
      price: Number,
      purchaseLink: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    projects: [{
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      image: String,
      clientName: String,
      completionDate: Date,
      testimonial: String,
      projectUrl: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    posts: [{
      title: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true
      },
      image: String,
      link: String,
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    timeline: [{
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        required: true
      },
      type: {
        type: String,
        enum: ['MILESTONE', 'UPDATE', 'ACHIEVEMENT'],
        default: 'UPDATE'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { timestamps: true }
)

// Keep the geospatial index
StartupSchema.index({ location: '2dsphere' })

// Add a compound index instead
StartupSchema.index(
  { 
    'inviteLinks.code': 1,
    'inviteLinks._id': 1 
  },
  { 
    sparse: true,
    unique: true,
    partialFilterExpression: {
      'inviteLinks.code': { $exists: true }
    }
  }
)

const Startup = mongoose.model('Startup', StartupSchema)
export default Startup
