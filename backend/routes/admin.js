
const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const { createDelivery } = require("../controllers/adminController");
const isAdmin = require("../middlewares/isAdmin");
const adminController = require("../controllers/adminController");

router.post(
  "/restaurant",
  protect,
  isAdmin,
  adminController.addRestaurant
);
router.post("/createDelivery", protect, authorizeRoles("admin"), createDelivery);

module.exports = router;








