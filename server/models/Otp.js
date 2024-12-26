import mongoose from "mongoose";

/**
 * @typedef {Object} Otp
 * @property {String} code - The name of the account holder
 * @property {String} token - The user token
 * @property {mongoose.Types.ObjectId} user - The user ID
 * @property {Date} createdAt - The date when the account was created
 * @property {Date} updatedAt - The date when the account was last updated
 */

/**
 * Otp schema.
 * @type {mongoose.Schema<Otp>}
 */
const OtpSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: "",
    },
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth',
      index: true
    }
  },
  { timestamps: true }
);

/**
 * Otp model.
 * @type {mongoose.Model<Otp>}
 */
const OtpModel = mongoose.model("Otp", OtpSchema);

export default OtpModel;
