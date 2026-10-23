const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true, maxlength: 100 },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    passwordHash: { type: String, select: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
module.exports = mongoose.model("User", schema);
