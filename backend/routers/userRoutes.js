const mongoose = require("mongoose");
const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();

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
    const user = await User.findById(req.params.id);

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

router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({
      email: req.body.email
    });

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

router.put("/:id", async (req, res) => {
  try {
    const userInfo = await User.findById(req.params.id);

    if (!userInfo) {
      return res.status(400).send("No user found.");
    }

    let newPasswordHash = userInfo.passwordHash;

    if (req.body.password) {
      newPasswordHash = bcryptjs.hashSync(req.body.password);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id, {
        email: req.body.email,
        passwordHash: newPasswordHash,
        isAdmin: req.body.isAdmin,
      }, {
        new: true,
      }
    );

    if (!user) {
      return res.status(400).send("Unable to update user");
    }
    return res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Impossible to update user.",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email
    });

    if (!user) {
      return res.status(400).send("Invalid email.");
    }

    if (user && bcryptjs.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign({
          userId: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET, {
          expiresIn: "30d",
        }
      );

      return res.status(200).json({
        user: user._id.toString(),
        token,
        isAdmin: user.isAdmin
      });
    }

    return res.status(400).send("Invalid email or password.");
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Impossible to login.",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user) {
      return res.status(400).send("User not found.");
    }

    return res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Impossible to delete user.",
    });
  }
});

module.exports = router;
