const express = require("express");
const CartItem = require("../models/cartItem");
const Cart = require("../models/cart");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cartList = await Cart.find().populate([
      {
        path: "cartItems",
        populate: { path: "item", populate: "category" },
      },
      { path: "user" },
    ]);

    if (!cartList) {
      return res.status(400).send("No carts available.");
    }

    res.status(200).json(cartList);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Impossible to get carts.",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).populate([
      {
        path: "cartItems",
        populate: { path: "item", populate: "category" },
      },
      { path: "user" },
    ]);

    if (!cart) {
      return res.status(400).send("Cart cannot be found");
    }

    return res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Impossible to get cart.",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const cartItemsIds = await Promise.all(
      req.body.cartItems.map(async (cartItem) => {
        let newCartItem = new CartItem({
          item: cartItem.item,
          quantity: cartItem.quantity,
        });

        const savedNewCartItem = await newCartItem.save();

        return savedNewCartItem._id;
      })
    );

    const totalPrices = await Promise.all(
      cartItemsIds.map(async (cartItemId) => {
        const cartItem = await CartItem.findById(cartItemId).populate(
          "item",
          "price"
        );
        return cartItem.item.price * cartItem.quantity;
      })
    );

    const totalPrice = totalPrices.reduce(
      (price1, price2) => price1 + price2,
      0
    );

    let cart = new Cart({
      cartItems: cartItemsIds,
      user: req.body.user,
      totalPrice,
    });

    const savedCart = await cart.save();

    if (!savedCart) {
      return res.status(400).send("Cart cannot be created.");
    }

    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Impossible to create cart.",
    });
  }
});

module.exports = router;
