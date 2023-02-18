const { mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    image: { type: String },
    password: { type: String, required: true, trim: true }, // encrypted password
    cnfPassword: { type: String, required: true, trim: true }, // encrypted password
    gender: { type: String, required: true, enum: ["Male", "Female", "LGBT"] },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema); // users
