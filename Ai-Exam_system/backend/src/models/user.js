import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["teacher", "student"],
    default: "student",
  },

  class: {
    type: String,
    required: true,
  },

  // isApproved: {
  //   type: Boolean,
  //   default: false,
  // },

  isVerified: {
    type: Boolean,
    default: false,
  },

  otp: String,
  verificationCode: String,
});

const User = mongoose.model("User", userSchema);

export default User;