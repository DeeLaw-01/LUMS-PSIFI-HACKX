import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 3,
      maxLength: 30
    },
    password: {
      type: String,
      required: true
    },
    bio: {
      type: String,
      maxLength: 500,
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
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Startup'
    },
    position: {
      type: String,
      trim: true
    },
    profilePicture: {
      type: String,
      default: '',
      get: url => {
        if (!url) return ''
        // If it's a Google profile picture, ensure it's using https
        if (url.startsWith('http://')) {
          return url.replace('http://', 'https://')
        }
        return url
      }
    }
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
  }
)

const User = mongoose.model('User', UserSchema)
export default User
