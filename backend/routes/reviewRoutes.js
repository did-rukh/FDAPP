const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  addReview,
  getRestaurantReviews,
  updateReview
} = require("../controllers/reviewController");

const Review = require("../models/Review"); 

router.post("/:orderId", protect, addReview);
router.get("/restaurant/:restaurantId", getRestaurantReviews);
router.get("/order/:orderId", protect, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId || !orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid orderId" });
    }

    const existingReview = await Review.findOne({
      order: orderId,
      user: req.user && req.user.id
    });

    res.json({ alreadyReviewed: !!existingReview,
               review: existingReview || null
     });

  } catch (error) {
    console.error("Review check error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.put("/:id", protect, updateReview); 



module.exports = router;