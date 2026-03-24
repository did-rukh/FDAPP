
// const express = require("express");
// const router = express.Router();

// const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
// const { createDelivery } = require("../controllers/adminController");
// const isAdmin = require("../middlewares/isAdmin");
// const adminController = require("../controllers/adminController");

// router.post(
//   "/restaurant",
//   protect,
//   isAdmin,
//   adminController.addRestaurant
// );
// router.post("/createDelivery", protect, authorizeRoles("admin"), createDelivery);

// module.exports = router;  // this is  the old one









const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");

//  CREATE RESTAURANT (admin only)
router.post(
  "/add-restaurant",
  protect,
  authorizeRoles("admin"),
  adminController.addRestaurant
);

// CREATE DELIVERY PARTNER (admin only)
router.post(
  "/create-delivery",
  protect,
  authorizeRoles("admin"),
  adminController.createDelivery
);

router.get(
  "/delivery-partners",
  protect,
  authorizeRoles("admin"),
  adminController.getDeliveryPartners
);

// BLOCK / UNBLOCK RESTAURANT
router.put(
  "/toggle-restaurant/:id",
  protect,
  authorizeRoles("admin"),
  adminController.toggleRestaurantBlock
);

// BLOCK / UNBLOCK DELIVERY
router.put(
  "/toggle-user/:id",
  protect,
  authorizeRoles("admin"),
  adminController.toggleUserBlock
);

module.exports = router;

