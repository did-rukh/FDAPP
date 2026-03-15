const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const bcrypt = require("bcryptjs");

exports.addRestaurant = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      street,
      city,
      state,
      zip
    } = req.body;

    if (!name || !email || !password || !phone || !street || !city) {
      return res.status(400).json({
        message: "All required fields must be filled"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Restaurant user already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const restaurantUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "restaurant",
      isVerified: true  
    });

    const restaurant = await Restaurant.create({
      name,
      email,
      phone,
      address: {
        street,
        city,
        state,
        zip
      },
      owner: restaurantUser._id, 
      rating: 0,
      status: "open"
    });

    res.status(201).json({
      message: "Restaurant created successfully",
      restaurantUserId: restaurantUser._id,
      restaurantId: restaurant._id
    });

  } catch (error) {
    console.error("Add restaurant error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

exports.createDelivery = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const deliveryUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "delivery",
      isVerified: true  
    });

    res.status(201).json({
      message: "Delivery partner created successfully",
      deliveryUser
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};