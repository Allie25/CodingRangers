const express = require("express");
const auth = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const controller = require("../controllers/bookingController");
const router = express.Router();
router.post("/", auth(), asyncHandler(controller.create));
router.get("/mine", auth(), asyncHandler(controller.mine));
router.delete("/:id", auth(), asyncHandler(controller.cancel));
module.exports = router;
