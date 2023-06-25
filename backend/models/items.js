const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
});

Item = mongoose.model("Item", itemSchema);

module.exports = Item;
