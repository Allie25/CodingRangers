const bcrypt = require("bcryptjs");
const Otp = require("../models/Otp");
const { sendMail } = require("./gmail");
module.exports = async function sendOtp(email, name, purpose) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  await Otp.deleteMany({ email, purpose });
  await Otp.create({
    email,
    name,
    purpose,
    codeHash: await bcrypt.hash(code, 10),
    expiresAt: new Date(Date.now() + 600000),
  });
  await sendMail({
    to: email,
    subject: "Your Coding Rangers sign-in code",
    text: `Your one-time code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your Coding Rangers one-time code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
  });
};
