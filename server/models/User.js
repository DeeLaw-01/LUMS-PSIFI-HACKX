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
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Startup'
    },
    position: {
      type: String,
      trim: true
    },
    profilePicture: {
      type: String, // Cloudinary URL
      default: '' // You might want to set a default avatar
    }
  },
  { timestamps: true }
)

const User = mongoose.model('User', UserSchema)
export default User
