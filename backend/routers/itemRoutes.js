const Item = require("../models/item");
const express = require("express");
const router = express.Router();
const uploads = require("../management/multer");
const Category = require("../models/category");

router.get("/", async (req, res) => {
  const items = await Item.find().populate("category");

  if (!items) {
    return res.status(400).send("No items found.");
  }

  return res.status(200).send(items);
});

router.post("/", uploads.single("image"), async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).send("Unknown category Id.");
    }

    const file = req.file;
    if (!file) {
      return res.status(400).send("Image required!");
    }

    const fileName = req.file.filename;
    const path = `${req.protocol}://${req.get("host")}/public/images`;

    console.log("path: ", path);

    let item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: `${path}${fileName}`,
      category: req.body.category,
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
