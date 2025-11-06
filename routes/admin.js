const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/admin");
const Order = require("../models/Order");

// Get all orders
router.get("/orders", auth, adminOnly, async (req, res) => {
  const orders = await Order.find().populate("user").populate("items.product");
  res.json({
    message: "Lấy danh sách sản phẩm thành công!",
    orders,
  });
});

// Update order status
router.put("/orders/:id", auth, adminOnly, async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json({
    message: "Cập nhật trạng thái thành công!",
    order,
  });
});

module.exports = router;
