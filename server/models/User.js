import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: function() {
        return !this.isAnonymous;
      },
      index: {
        unique: true,
        sparse: true,
        partialFilterExpression: { isAnonymous: false }
      },
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: function() {
        return !this.isAnonymous;
      }
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    anonymousId: {
      type: String,
      unique: true,
      sparse: true,
      default: function() {
        return this.isAnonymous ? `anon_${new mongoose.Types.ObjectId().toString()}` : undefined;
      }
    },
    bio: {
      type: String,
      trim: true,
      default: ''
    },
    location: {
      type: String,
      trim: true,
      default: ''
    },
    website: {
      type: String,
      trim: true,
      default: ''
    },
    profilePicture: {
      type: String,
      default: ''
    },
    settings: {
      emailNotifications: {
        type: Boolean,
        default: true
      },
      darkMode: {
        type: Boolean,
        default: true
      }
    },
    permissions: {
      canComment: {
        type: Boolean,
        default: function() {
          return !this.isAnonymous;
        }
      },
      canMessage: {
        type: Boolean,
        default: function() {
          return !this.isAnonymous;
        }
      },
      canCreateStartup: {
        type: Boolean,
        default: function() {
          return !this.isAnonymous;
        }
      },
      canFollowStartup: {
        type: Boolean,
        default: function() {
          return !this.isAnonymous;
        }
      },
      canJoinStartup: {
        type: Boolean,
        default: function() {
          return !this.isAnonymous;
        }
      },
      canLike: {
        type: Boolean,
        default: true
      },
      canSave: {
        type: Boolean,
        default: true
      }
    },
    startups: [
      {
        startup: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Startup'
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
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
      }
    ]
  },
  { timestamps: true }
)

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isAnonymous) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (this.isAnonymous) return false
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw error
  }
}

const User = mongoose.model('User', UserSchema)
export default User
