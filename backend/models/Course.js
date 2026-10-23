const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, maxlength: 5000 },
    instructor: { type: String, trim: true, default: "" },
    duration: { type: String, trim: true, default: "" },
    fee: { type: Number, min: 0, default: 0 },
    capacity: { type: Number, min: 1, default: 30 },
    imageUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Course", schema);
