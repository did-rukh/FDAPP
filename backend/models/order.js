const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    deliveryPartner: {
  type: mongoose.Schema.Types.ObjectId, ref: "User"},
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, default: 1 }
        }
    ],
    totalPrice: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ["PLACED","CONFIRMED","PREPARING","ASSIGNED","PICKED_UP","DELIVERED","CANCELLED"], 
        default: "PLACED" 
    },
    deliveryAddress: String
}, { timestamps: true }); 

module.exports = mongoose.model("Order", orderSchema);
 
