const Booking = require("../models/Booking");
const Course = require("../models/Course");
exports.create = async (req, res) => {
  const course = await Course.findOne({
    _id: req.body.courseId,
    status: "published",
  });
  if (!course) return res.status(404).json({ error: "Course not found" });
  if (
    (await Booking.countDocuments({
      course: course._id,
      status: "approved",
    })) >= course.capacity
  )
    return res.status(409).json({ error: "Course is full" });
  try {
    const booking = await Booking.create({
      user: req.user._id,
      course: course._id,
    });
    return res.status(201).json({ booking });
  } catch (error) {
    if (error.code === 11000)
      return res.status(409).json({ error: "You already booked this course" });
    throw error;
  }
};
exports.mine = async (req, res) =>
  res.json({
    bookings: await Booking.find({ user: req.user._id })
      .populate("course")
      .sort({ createdAt: -1 }),
  });
exports.cancel = async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  if (booking.status !== "pending")
    return res
      .status(409)
      .json({ error: "Only pending bookings can be cancelled" });
  booking.status = "cancelled";
  await booking.save();
  res.json({ booking });
};
exports.adminList = async (_req, res) =>
  res.json({
    bookings: await Booking.find()
      .populate("user", "name email")
      .populate("course", "title fee")
      .sort({ createdAt: -1 }),
  });
exports.review = async (req, res) => {
  const { status, note = "" } = req.body;
  if (!["approved", "rejected"].includes(status))
    return res
      .status(400)
      .json({ error: "Status must be approved or rejected" });
  const booking = await Booking.findById(req.params.id).populate("course");
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  if (booking.status !== "pending")
    return res.status(409).json({ error: "Booking has already been reviewed" });
  if (
    status === "approved" &&
    (await Booking.countDocuments({
      course: booking.course._id,
      status: "approved",
    })) >= booking.course.capacity
  )
    return res.status(409).json({ error: "Course is full" });
  booking.status = status;
  booking.note = String(note).slice(0, 500);
  booking.reviewedBy = req.user._id;
  booking.reviewedAt = new Date();
  await booking.save();
  res.json({ booking });
};
