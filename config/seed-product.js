const Product = require("../models/Product");

const seedProducts = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      {
        name: "Áo thun nam basic",
        price: 199000,
        description: "Chất liệu cotton thoáng mát, unisex.",
        category: "Thời trang",
        stock: 100,
        image: "https://example.com/ao-thun.jpg",
      },
      {
        name: "Quần jeans nam",
        price: 399000,
        description: "Kiểu dáng trẻ trung, dễ phối đồ.",
        category: "Thời trang",
        stock: 50,
        image: "https://example.com/quan-jeans.jpg",
      },
    ]);
    console.log("✅ Seeded sample products successfully!");
  } else {
    console.log(`📦 Database already has ${count} products.`);
  }
};

module.exports = seedProducts;
