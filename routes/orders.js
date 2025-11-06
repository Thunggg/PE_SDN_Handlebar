const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const User = require("../models/User");

// Checkout (Place order)
router.post("/checkout", auth, async (req, res) => {
  const user = await User.findById(req.user.id).populate("cart.product");

  if (!user.cart.length) {
    return res.status(400).json({ msg: "Giỏ hàng đang trống!" });
  }

  const item = user.cart.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
  }));

  const total = user.cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const order = new Order({
    user: user.id,
    items: item,
    total,
  });

  await order.save();

  user.cart = [];
  await user.save();

  res.status(201).json({ msg: "Đặt hàng thành công!", order });
});

// Get user's order history
router.get("/my-orders", auth, async (req, res) => {
  const order = await Order.find({ user: req.user.id }).populate(
    "items.product"
  );
  res.status(201).json({ msg: "Các đơn hàng đã đặt!", order });
});
module.exports = router;
