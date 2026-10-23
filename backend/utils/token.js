const jwt = require("jsonwebtoken");
function signToken(user) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET must be configured");
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
}
const cleanUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});
module.exports = { signToken, cleanUser };
