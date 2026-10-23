module.exports = function errorHandler(err, _req, res, _next) {
  console.error(err);
  if (err.name === "ValidationError")
    return res.status(400).json({ error: err.message });
  if (err.name === "CastError")
    return res.status(400).json({ error: "Invalid ID" });
  if (err.code === 11000)
    return res.status(409).json({ error: "Record already exists" });
  return res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
};
