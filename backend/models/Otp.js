const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    codeHash: { type: String, required: true },
    name: { type: String, default: "" },
    purpose: {
      type: String,
      enum: ["login", "register", "admin"],
      required: true,
    },
    expiresAt: { type: Date, required: true, expires: 0 },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Otp", schema);
