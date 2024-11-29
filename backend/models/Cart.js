const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  ingredients: [String],
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
