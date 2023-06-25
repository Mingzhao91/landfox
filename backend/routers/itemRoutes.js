const Item = require("../models/item");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const items = await Item.find();

  if (!items) {
    return res.status(400).send("No items found.");
  }

  return res.status(200).send(items);
});

router.post("/", async (req, res) => {
  try {
    let item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.body.image,
    });

    await item.save();
    return res.status(201).send("Items created successfully!");
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Impossible to create product.",
    });
  }
});

module.exports = router;
