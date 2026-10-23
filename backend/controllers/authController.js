const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Otp = require("../models/Otp");
const sendOtp = require("../utils/sendOtp");
const { signToken, cleanUser } = require("../utils/token");

exports.register = async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();
  if (!name || !email || !/^\S+@\S+\.\S+$/.test(email))
    return res.status(400).json({ error: "Valid name and email are required" });
  if (await User.exists({ email }))
    return res
      .status(409)
      .json({ error: "An account with this email already exists; use login" });
  await sendOtp(email, name, "register");
  res
    .status(202)
    .json({ message: "Verification code sent", expiresInSeconds: 600 });
};

exports.login = async (req, res) => {
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email))
    return res.status(400).json({ error: "Valid email is required" });
  const user = await User.findOne({ email, isActive: true });
  if (!user)
    return res.status(404).json({ error: "Account not found; register first" });
  const purpose = user.role === "admin" ? "admin" : "login";
  await sendOtp(email, "", purpose);
  res
    .status(202)
    .json({ message: "Verification code sent", purpose, expiresInSeconds: 600 });
};

exports.verifyOtp = async (req, res) => {
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();
  const code = String(req.body.code || "").trim();
  const purpose = String(req.body.purpose || "login");
  if (
    !/^\d{6}$/.test(code) ||
    !["login", "register", "admin"].includes(purpose)
  )
    return res
      .status(400)
      .json({ error: "Valid six-digit code and purpose are required" });
  const record = await Otp.findOne({
    email,
    purpose,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });
  if (!record || !(await bcrypt.compare(code, record.codeHash)))
    return res.status(400).json({ error: "Invalid or expired code" });
  await Otp.deleteMany({ email, purpose });
  let user = await User.findOne({ email });
  if (purpose === "register") {
    if (user) return res.status(409).json({ error: "Account already exists" });
    user = await User.create({ email, name: record.name, role: "user" });
  } else if (
    !user ||
    (purpose === "admin" && user.role !== "admin") ||
    !user.isActive
  ) {
    return res.status(401).json({ error: "Account unavailable" });
  }
  res.json({ token: signToken(user), user: cleanUser(user) });
};

exports.me = (req, res) => res.json({ user: cleanUser(req.user) });
