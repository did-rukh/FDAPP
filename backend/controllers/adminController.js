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
  
    if (!name || !email || !password || !phone || !street || !city || !state || !zip) {
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
      // deliveryUser
       user: {
      id: deliveryUser._id,
      name: deliveryUser.name,
      email: deliveryUser.email,
      role: deliveryUser.role
    }
   });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDeliveryPartners = async (req, res) => {
  try {
    const partners = await User.find({ role: "delivery" })
      .select("name email isBlocked");

    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleRestaurantBlock = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.isBlocked = !restaurant.isBlocked;
    await restaurant.save();

    res.json({
      message: restaurant.isBlocked
        ? "Restaurant blocked"
        : "Restaurant unblocked",
      isBlocked: restaurant.isBlocked
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

 exports.toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "delivery") {
      return res.status(400).json({ message: "Only delivery can be blocked" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: user.isBlocked
        ? "Delivery partner blocked"
        : "Delivery partner unblocked",
      isBlocked: user.isBlocked
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 

