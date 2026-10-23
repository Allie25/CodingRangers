const Course = require("../models/Course");
exports.listPublished = async (_req, res) =>
  res.json({
    courses: await Course.find({ status: "published" }).sort({ createdAt: -1 }),
  });
exports.getPublished = async (req, res) => {
  const course = await Course.findOne({
    _id: req.params.id,
    status: "published",
  });
  if (!course) return res.status(404).json({ error: "Course not found" });
  res.json({ course });
};
exports.adminList = async (_req, res) =>
  res.json({ courses: await Course.find().sort({ createdAt: -1 }) });
exports.create = async (req, res) => {
  const {
    title,
    description,
    instructor,
    duration,
    fee,
    capacity,
    imageUrl,
    status,
  } = req.body;
  if (!title || !description)
    return res
      .status(400)
      .json({ error: "Title and description are required" });
  const course = await Course.create({
    title,
    description,
    instructor,
    duration,
    fee,
    capacity,
    imageUrl,
    status,
    createdBy: req.user._id,
  });
  res.status(201).json({ course });
};
exports.update = async (req, res) => {
  const allowed = [
    "title",
    "description",
    "instructor",
    "duration",
    "fee",
    "capacity",
    "imageUrl",
    "status",
  ];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowed.includes(key)),
  );
  const course = await Course.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!course) return res.status(404).json({ error: "Course not found" });
  res.json({ course });
};
exports.remove = async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  await require("../models/Booking").deleteMany({ course: course._id });
  res.json({ message: "Course and its bookings deleted" });
};
