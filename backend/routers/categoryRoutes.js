const Category = require("../models/category");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories) {
      return res.status(400).send("No categories available.");
    }

    res.status(200).send(categories);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Impossible to get categories.",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      categoryType: req.body.categoryType,
    });

    const savedCategory = await category.save();

    if (savedCategory) {
      return res.status(200).send(savedCategory);
    } else {
      return res.status(400).send("Category cannot be created.");
    }
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Impossible to create a category.",
    });
  }
});

module.exports = router;
