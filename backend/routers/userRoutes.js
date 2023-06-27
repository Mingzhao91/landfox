const mongoose = require("mongoose");
const express = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");

    if (!users) {
      res.status(400).send("No users found.");
    }

    return res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Impossible to get users.",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");

    if (!user) {
      res.status(400).send("No user found");
    }

    return res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Impossible to get this user.",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).send("User is already existed.");
    }

    let user = new User({
      email: req.body.email,
      passwordHash: bcryptjs.hashSync(req.body.password),
      isAdmin: req.body.isAdmin,
    });

    const savedUser = await user.save();

    if (!savedUser) {
      return res.status(400).send("User cannot be created.");
    }

    return res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Impossible to create an user.",
    });
  }
});

module.exports = router;
