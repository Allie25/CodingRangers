const bcrypt = require("bcryptjs");
const User = require("../models/User");
module.exports = async function seedAdmin() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) return;
  const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
  const existing = await User.findOne({ email }).select("+passwordHash");
  if (!existing)
    return User.create({
      name: process.env.ADMIN_NAME || "Coding Rangers Admin",
      email,
      role: "admin",
      passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
    });
  if (existing.role !== "admin") {
    existing.role = "admin";
    existing.passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await existing.save();
  }
};
