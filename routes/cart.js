const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Product = require("../models/Product");

// Get cart (with product details)
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id).populate("cart.product");
  res.json(user);
});

// Add to cart
router.post("/add", auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(400).json("Bạn chưa đăng nhập!");
    }

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    return res.json({
      message: "Thêm vào giỏ hàng thành công",
    });
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Remove from cart
router.post("/remove", auth, async (req, res) => {
  const { productId } = req.body;

  const user = await User.findById(req.user.id);

  user.cart = user.cart.filter((item) => item.product.toString() !== productId);

  await user.save();

  return res.json({
    message: "Đã xóa khỏi giỏ hàng!",
  });
});

module.exports = router;
