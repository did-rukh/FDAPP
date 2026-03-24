const express = require("express");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const {
  placeOrder,getMyOrders,getRestaurantOrders,updateOrderStatus,cancelOrderByUser,
  assignDeliveryPartner, updateDeliveryStatus,getDeliveryOrders
} = require("../controllers/orderController");

const User = require("../models/User");
const Order = require("../models/order"); 

const router = express.Router();

// user

router.post("/", protect, placeOrder);

router.get("/", protect, getMyOrders);

router.put("/:orderId/cancel", protect, cancelOrderByUser);

// restrnt

router.get("/restaurant", protect, getRestaurantOrders);
router.put("/:orderId/status", protect, updateOrderStatus);
router.put("/:orderId/assign",
   protect,authorizeRoles("restaurant"),assignDeliveryPartner
);

//  delivery
router.put("/:orderId/delivery-status",
  protect,authorizeRoles("delivery"),updateDeliveryStatus
);

router.get("/delivery",
   protect,authorizeRoles("delivery"),getDeliveryOrders
);
// router.get(
//   "/delivery",
//   protect,
//   authorizeRoles("delivery"),
//   async (req, res) => {
//     try {
//       const deliveryPartnerId = req.user._id; 

//       const orders = await Order.find({
//         deliveryPartner: deliveryPartnerId,
//         status: { $in: ["ASSIGNED", "PICKED_UP"] },
//       }).populate("items.product"); 

//       res.status(200).json(orders);
//     } catch (error) {
//       console.error("Error fetching delivery orders:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );   

router.get("/delivery-partners", protect, authorizeRoles("restaurant"), async (req, res) => {
  try {
    const partners = await User.find({ role: "delivery" }).select("name email");
    res.status(200).json(partners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;