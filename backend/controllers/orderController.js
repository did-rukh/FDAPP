const Order = require("../models/order");
const Product = require("../models/product");
const Restaurant = require("../models/Restaurant");

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items } = req.body;

    //validateitem
    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order items are required"
      });
    }

    const firstProduct = await Product.findById(items[0].product);

    if (!firstProduct) {
      return res.status(400).json({
        message: "Product not found"
      });
    }

    const restaurantId = firstProduct.restaurant.toString();
    let totalPrice = 0;
    //  check all product
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

      if (product.restaurant.toString() !== restaurantId) {
        return res.status(400).json({
          message: "All items must be from one restaurant"
        });
      }

      
      totalPrice += product.price * item.quantity;
    }

    
    const order = await Order.create({
      user: userId,
      restaurant: restaurantId,
      items,
      totalPrice
    });

    
    res.status(201).json(order);

  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};


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


exports.getRestaurantOrders = async(req,res)=>{
  try{
    const restaurant = await Restaurant.findOne({ owner: req.user._id });

    if(!restaurant){
      return res.status(404).json({
        message: "Restaurant not found for this user "
      });
    }

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


exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    
    if (!status) {
      return res.status(400).json({
        message: "Status is required"
      });
    }

  
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(403).json({
        message: "Not authorized as restaurant"
      });
    }

  
    const order = await Order.findOne({
      _id: orderId,
      restaurant: restaurant._id
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }



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


if (!validTransitions[currentStatus].includes(status)) {  //preventinvalid updte
  return res.status(400).json({
    message: `Cannot change status from ${currentStatus} to ${status}`
  });
}

    order.status = status;
    await order.save();  //change permanent

    res.json(order);

  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};


exports.cancelOrderByUser = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id          
    });                        

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (!["PLACED", "CONFIRMED"].includes(order.status)) {
      return res.status(400).json({
        message: "Order cannot be cancelled at this stage"
      });
    }

    
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

//  GET DELIVERY PARTNER ORDERS (FIXED)
exports.getDeliveryOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartner: req.user._id
    })
      .populate("user", "name email")
      .populate("restaurant", "name")
      .populate("items.product", "name price");

    res.json(orders);
  } catch (error) {
    console.error("Get delivery orders error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};
