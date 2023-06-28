const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  cartItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CartItem",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalPrice: {
    type: Number,
  },
});

Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
