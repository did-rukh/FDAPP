const Review = require("../models/Review");
const Order = require("../models/order");
const Restaurant = require("../models/Restaurant");

const addReview = async (req, res) => {
  try {
  //   const { rating, comment } = req.body;
  //   const orderId = req.params.orderId;
  const { comment } = req.body;
  const rating = Number(req.body.rating); 
  const orderId = req.params.orderId;

   //validation
  if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
  return res.status(400).json({
    message: "Rating must be a number between 1 and 5"
  });
}

    // if (!rating || rating < 1 || rating > 5) {
    //   return res.status(400).json({ message: "Rating must be between 1 and 5" });
    // } 

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Must be delivered
    if (order.status !== "DELIVERED") {
      return res.status(400).json({
        message: "You can review only after delivery"
      });
    }

    
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Prevent duplicate review
    const existingReview = await Review.findOne({ order: orderId, user: req.user.id });
    if (existingReview) {
      return res.status(400).json({
        message: "You already reviewed this order"
      });
    }

    const review = await Review.create({
      user: req.user.id,
      restaurant: order.restaurant,
      order: orderId,
      rating,
      comment
    });
 
    //update restaurant rating
     const restaurant = await Restaurant.findById(order.restaurant);
     
  if (!restaurant.totalReviews) restaurant.totalReviews = 0;
if (!restaurant.averageRating) restaurant.averageRating = 0;

restaurant.totalReviews += 1;

restaurant.averageRating =
((restaurant.averageRating * (restaurant.totalReviews - 1)) + rating)
/ restaurant.totalReviews;


    await restaurant.save();

    res.status(201).json({
      message: "Review added successfully",
      review
    });

  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ message: error.message });
  }
};
  

const getRestaurantReviews = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;

    const reviews = await Review.find({ restaurant: restaurantId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);

  } catch (error) {
    console.error("Fetch reviews error:", error);
    res.status(500).json({ message: error.message });
  }
};


//  UPDATE REVIEW
const updateReview = async (req, res) => {
  try {
    const { comment } = req.body;
    const rating = req.body.rating ? Number(req.body.rating) : undefined;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    //  Only same user can edit
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to edit this review"
      });
    }

    // VALIDATION (FIX ADDED)
    if (rating && (isNaN(rating) || rating < 1 || rating > 5)) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    // Update fields
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    res.json({
      message: "Review updated successfully",
      review
    });

  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ message: error.message });
  }
};


// // UPDATE REVIEW (NEW)
// const updateReview = async (req, res) => {
//   try {
//     const { rating, comment } = req.body;

//     const review = await Review.findById(req.params.id);

//     if (!review) {
//       return res.status(404).json({ message: "Review not found" });
//     }

//     //  Only same user can edit
//     if (review.user.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Not authorized to edit this review" });
//     }

//     //  Update values
//     review.rating = rating || review.rating;
//     review.comment = comment || review.comment;

//     await review.save();

//     res.json({ message: "Review updated", review });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

module.exports = { addReview, getRestaurantReviews, updateReview };