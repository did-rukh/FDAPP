const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const Product = require("../models/Product");
const Restaurant = require("../models/Restaurant");

router.post(
  "/product",
  // authMiddleware,
  protect,
  authorizeRoles("restaurant"),
  async (req, res) => {
    try {
      const restaurant = await Restaurant.findOne({ owner: req.user._id });
      if (!restaurant)
        return res.status(404).json({ message: "Restaurant not found"});

      const product = await Product.create({
        restaurant: restaurant._id,
        ...req.body,
      });

      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get(
  "/my-restaurant",
  protect,
  authorizeRoles("restaurant"),
  async (req, res) => {
    try {

      const restaurant = await Restaurant.findOne({ owner: req.user._id });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      res.json(restaurant);

    } catch (error) {

      res.status(500).json({ message: error.message });

    }
  }
);

router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

