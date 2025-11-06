const mongoose = require("mongoose");
const seedProducts = require("./seed-product");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    seedProducts();

    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
