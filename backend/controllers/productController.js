const Product = require("../models/product");
const Restaurant = require("../models/Restaurant");

exports.getProducts = async (req, res, next) => {
  try {
    const { restaurantId } = req.query;
    let filter = {};

    if (restaurantId) {
      filter.restaurant = restaurantId;
    } 
    else {
      filter.available = true;
    }

    const products = await Product.find(filter);
    res.json(products);

  } catch (err) {
    console.log("error fetching products", err);
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    let restaurantId;

    if (req.user.role === "restaurant") {
      const restaurant = await Restaurant.findOne({ owner: req.user._id });
      if (!restaurant) return res.status(400).json({ message: "Restaurant not found for this user" });
      restaurantId = restaurant._id;
    } else if (req.user.role === "admin") {
      restaurantId = req.body.restaurantId;
      if (!restaurantId) return res.status(400).json({ message: "restaurantId is required" });
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, price } = req.body;

  if (!name || !price) {
  return res.status(400).json({ message: "name and price are required" });
}
    
    const imageUrl = req.file?.path || "";

    const product = await Product.create({
      ...req.body,
      image: imageUrl,   
      restaurant: restaurantId
    });

   
    res.status(201).json(product);
  } catch (err) {
    console.log("error creating product", err);
    next(err);
  }
};
