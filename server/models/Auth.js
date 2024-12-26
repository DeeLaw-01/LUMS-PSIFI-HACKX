import mongoose from 'mongoose'

/**
 * @typedef {Object} Auth
 * @property {String} name - The name of the user
 * @property {String} email - The email of the user (optional)
 * @property {String} phoneNumber - The phone number of the user (optional)
 * @property {String} hashedPassword - The hashed password of the user
 * @property {Number} credit - The credit balance of the user
 * @property {mongoose.Types.ObjectId} account - Reference to the Account model
 * @property {Boolean} isAdmin - Flag indicating if the user is an admin
 * @property {Date} createdAt - The date when the auth record was created
 * @property {Date} updatedAt - The date when the auth record was last updated
 */

/**
 * Auth schema.
 * @type {mongoose.Schema<Auth>}
 */
const AuthSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    hashedPassword: {
      type: String
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true
    },
    profilePicture: {
      type: String
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

/**
 * Auth model.
 * @type {mongoose.Model<Auth>}
 */
const AuthModel = mongoose.model('Auth', AuthSchema)

export default AuthModel
