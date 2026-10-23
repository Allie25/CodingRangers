const express = require("express");
const auth = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const controller = require("../controllers/courseController");
const router = express.Router();
router.get("/", auth(), asyncHandler(controller.listPublished));
router.get("/:id", auth(), asyncHandler(controller.getPublished));
module.exports = router;
