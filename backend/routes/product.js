
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const Product = require("../models/Product"); 
const upload = require("../config/multer");
const {
  getProducts,createProduct
} = require("../controllers/productController");

router.get("/", getProducts);
router.post(
  "/",
  protect,
  authorizeRoles("admin", "restaurant"),
  upload.single("image"), 
  createProduct
);
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "restaurant"),
  async (req, res) => {

    try {

      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      product.available = !product.available;

      await product.save();

      res.json(product);

    } catch (error) {

      res.status(500).json({ message: error.message });

    }

  }
);






router.put(
  "/:id/image",
  protect,
  authorizeRoles("admin", "restaurant"),
  upload.single("image"),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });

      if (!req.file) return res.status(400).json({ message: "No image uploaded" });

      product.image = req.file.path; 
      await product.save();

      res.json(product);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
