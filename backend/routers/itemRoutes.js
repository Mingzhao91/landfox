const express = require("express");
const mongoose = require("mongoose");
const uploads = require("../management/multer");
const Item = require("../models/item");
const Category = require("../models/category");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const items = await Item.find().populate("category");

    if (!items) {
      return res.status(400).send("No items found.");
    }

    return res.status(200).send(items);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Impossible to get items.",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("category");

    if (!item) {
      return res.status(400).send("No item was found.");
    }

    return res.status(200).send(item);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Impossible to get item.",
    });
  }
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
    const path = `${req.protocol}://${req.get("host")}/public/images/`;

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
      message: "Impossible to create item.",
    });
  }
});

router.put("/:id", uploads.single("image"), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Id");
    }

    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).send("Invalid category Id");
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(400).send("Invalid item Id");
    }

    const file = req.file;
    let image;

    if (file) {
      const fileName = file.filename;
      const path = `${req.protocol}://${req.get("host")}/public/images/`;
      image = `${path}${fileName}`;
    } else {
      image = item.image;
    }

    const modifiedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: image,
        category: req.body.category,
      },
      { new: true }
    );

    if (!modifiedItem) {
      return res.status(500).send("The item cannot be updated.");
    }

    res.status(200).json(modifiedItem);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Impossible to update item.",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndRemove(req.params.id);

    if (!deletedItem) {
      return res.status(400).send("Item not found.");
    }

    return res.status(200).send("Item deleted successfully.");
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Error durring item deletion.",
    });
  }
});

module.exports = router;
