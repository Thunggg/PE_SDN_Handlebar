const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: String,
    category: String,
    stock: {
      type: Number,
      default: 0,
    },
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
