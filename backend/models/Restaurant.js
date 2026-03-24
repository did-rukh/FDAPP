const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    zip: { type: String },
  },
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" }], 
  rating: { type: Number, default: 0 },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  
  averageRating: {
  type: Number,
  default: 0
},
totalReviews: {
  type: Number,
  default: 0
},

isBlocked: {
  type: Boolean,
  default: false
}
}, { timestamps: true });

module.exports = mongoose.model("Restaurant", restaurantSchema);
