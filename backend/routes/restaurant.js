const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const Product = require("../models/product");
const Restaurant = require("../models/Restaurant");

// router.post(
//   "/product",
  
//   protect,
//   authorizeRoles("restaurant"),
//   async (req, res) => {
//     try {
//       const restaurant = await Restaurant.findOne({ owner: req.user._id });
//       if (!restaurant)
//         return res.status(404).json({ message: "Restaurant not found"});

//       const product = await Product.create({
//         restaurant: restaurant._id,
//         ...req.body,
//       });

//       res.status(201).json(product);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   }
// );


// router.get("/", async (req, res) => {
//   try {
//     const restaurants = await Restaurant.find({
//       isBlocked: false                                   // new change  
//     });
//     res.json(restaurants);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.get("/", protect, async (req, res) => {
//   try {
//     let filter = {};

//     // ✅ If NOT admin → hide blocked
//     if (req.user.role !== "admin") {
//       filter.isBlocked = false;
//     }

//     const restaurants = await Restaurant.find(filter);

//     res.json(restaurants);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

router.get("/", async (req, res) => {
  try {
    let filter = {};

    const authHeader = req.headers.authorization;

    if (authHeader) {
      try {
        const token = authHeader.split(" ")[1];

        const decoded = require("jsonwebtoken").verify(
          token,
          process.env.JWT_SECRET
        );

        // ✅ If NOT admin → hide blocked
        if (decoded.role !== "admin") {
          filter.isBlocked = false;
        }

      } catch (err) {
        // invalid token → treat as guest
        filter.isBlocked = false;
      }
    } else {
      // ✅ guest user
      filter.isBlocked = false;
    }

    const restaurants = await Restaurant.find(filter);

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

    if (!restaurant || restaurant.isBlocked) {
      return res.status(403).json({ message: "Restaurant is blocked" });
    }

    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

