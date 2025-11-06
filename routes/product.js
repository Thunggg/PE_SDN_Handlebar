const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

// Tìm tất cả sản phẩm
router.get("/", auth, async (req, res, next) => {
  try {
    const products = await Product.find();

    res.json({
      message: "Tìm tất cả sản phẩm thành công",
      products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Tìm sản phẩm theo id
router.get("/:id", auth, async (req, res, next) => {
  try {
    const products = await Product.findById(req.params.id);
    res.json({
      message: "Tìm sản phẩm theo id thành công",
      products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Thêm sản phẩm
router.post("/", auth, adminOnly, async (req, res, next) => {
  try {
    const newProduct = await Product(req.body);
    const savedProduct = await newProduct.save();

    res.json({
      message: "Tạo mới thành công",
      savedProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// sửa sản phẩm
router.put("/:id", auth, adminOnly, async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json({
    message: "cập nhật sản phẩm thành công!",
    updated,
  });
});

// xóa sản phẩm
router.delete("/:id", auth, adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);

  res.json({
    message: "Xóa sản phẩm thành công!",
  });
});
module.exports = router;
