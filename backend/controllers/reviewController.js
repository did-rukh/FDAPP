const Review = require("../models/Review");
const Order = require("../models/order");
const Restaurant = require("../models/Restaurant");

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const orderId = req.params.orderId;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    } 

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

    // Must be order owner
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

     const restaurant = await Restaurant.findById(order.restaurant);
     
  if (!restaurant.totalReviews) restaurant.totalReviews = 0;
if (!restaurant.averageRating) restaurant.averageRating = 0;

restaurant.totalReviews += 1;

restaurant.averageRating =
((restaurant.averageRating * (restaurant.totalReviews - 1)) + rating)
/ restaurant.totalReviews;


    await restaurant.save();

    res.status(201).json(review);

  } catch (error) {
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
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addReview, getRestaurantReviews };