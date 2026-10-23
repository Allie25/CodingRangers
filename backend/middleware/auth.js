const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
module.exports = function auth(requiredRole) {
  return asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token)
      return res.status(401).json({ error: "Authentication required" });
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    const user = await User.findById(payload.sub);
    if (!user || !user.isActive)
      return res.status(401).json({ error: "Account unavailable" });
    if (requiredRole && user.role !== requiredRole)
      return res.status(403).json({ error: "Admin access required" });
    req.user = user;
    next();
  });
};
