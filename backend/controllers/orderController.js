const Order = require("../models/order");
const Product = require("../models/product");
const Restaurant = require("../models/Restaurant");


// PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items } = req.body;

    //  VALIDATE ITEMS
    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order items are required"
      });
    }

    //  GET FIRST PRODUCT
    const firstProduct = await Product.findById(items[0].product);

    if (!firstProduct) {
      return res.status(400).json({
        message: "Product not found"
      });
    }

    const restaurantId = firstProduct.restaurant.toString();
    let totalPrice = 0;

    //  CHECK ALL PRODUCTS
    for (let item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(400).json({
          message: "Product not found"
        });
      }


      
      if (!product.available) {
        return res.status(400).json({                            
          message: `${product.name} is currently unavailable`
       });
     }


      //  ONE RESTAURANT ONLY
      if (product.restaurant.toString() !== restaurantId) {
        return res.status(400).json({
          message: "All items must be from one restaurant"
        });
      }

      //  CALCULATE TOTAL PRICE
      totalPrice += product.price * item.quantity;
    }

    //   CREATE ORDER
    const order = await Order.create({
      user: userId,
      restaurant: restaurantId,
      items,
      totalPrice
    });

    //  RESPONSE
    res.status(201).json(order);

  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

// GET MY ORDERS (USER)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("restaurant", "name")
      .populate("items.product", "name price");

    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

//get orders for restaurant 
exports.getRestaurantOrders = async(req,res)=>{
  try{
    const restaurant = await Restaurant.findOne({ owner: req.user._id });

    if(!restaurant){
      return res.status(404).json({
        message: "Restaurant not found for this user "
      });
    }
    //finds order for that restaurant
   const orders = await Order.find({ restaurant: restaurant._id })
    .populate("user", "name email")
    .populate("items.product", "name price");

    res.json(orders);
  }catch(error){
    console.error("Get restaurant orders error:", error);
    res.status(500).json({
      message: "Server error"
    }); 
  }
}

// UPDATE ORDER STATUS (RESTAURANT)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

      // 1️ Validate status exists
    if (!status) {
      return res.status(400).json({
        message: "Status is required"
      });
    }

    // find restaurant owned by logged-in user
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(403).json({
        message: "Not authorized as restaurant"
      });
    }

    // find order of this restaurant
    const order = await Order.findOne({
      _id: orderId,
      restaurant: restaurant._id
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }


  // Define valid status transitions
const validTransitions = {
  PLACED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["ASSIGNED"],
  ASSIGNED: ["PICKED_UP"],
  PICKED_UP: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: []
};

const currentStatus = order.status;

// Check if status change is allowed
if (!validTransitions[currentStatus].includes(status)) {
  return res.status(400).json({
    message: `Cannot change status from ${currentStatus} to ${status}`
  });
}

    order.status = status;
    await order.save();

    res.json(order);

  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};


// USER CANCEL ORDER
exports.cancelOrderByUser = async (req, res) => {
  try {
    const { orderId } = req.params;

    //  Find user's order
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    // 2 Allow cancel only before PREPARING
    if (!["PLACED", "CONFIRMED"].includes(order.status)) {
      return res.status(400).json({
        message: "Order cannot be cancelled at this stage"
      });
    }

    //  Update status
    order.status = "CANCELLED";
    await order.save();

    res.json({
      message: "Order cancelled successfully",
    order
    });

  } catch (error) {
    console.error("Cancel order error:", error);
     res.status(500).json({
      message: "Server error"
    });
  }
};


exports.assignDeliveryPartner = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryPartnerId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "PREPARING") {
      return res.status(400).json({
        message: "Order must be PREPARING to assign delivery partner"
      });
    }

    order.deliveryPartner = deliveryPartnerId;
    order.status = "ASSIGNED";

    await order.save();

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      deliveryPartner: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not assigned to you"
      });
    }

    if (!["PICKED_UP", "DELIVERED"].includes(status)) {
      return res.status(400).json({
        message: "Invalid delivery status"
      });
    }

    order.status = status;
    await order.save();

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


