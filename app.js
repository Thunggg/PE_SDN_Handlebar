require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const productRoute = require("./routes/product");
const authRoute = require("./routes/auth");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/orders");
const adminRoute = require("./routes/admin");

const viewContext = require("./middleware/viewContext");

const connectDB = require("./config/db");
const exphbs = require("express-handlebars"); // handlebars
const path = require("path");
const verifyToken = require("./middleware/auth");
const Product = require("./models/Product");

const app = express();

app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
    defaultLayout: "main",
    helpers: {
      eq: (a, b) => a === b,
      gt: (a, b) => a > b,
      lt: (a, b) => a < b,
      gte: (a, b) => a >= b,
      lte: (a, b) => a <= b,
      ne: (a, b) => a !== b,
      and: (a, b) => a && b,
      or: (a, b) => a || b,
      not: (a) => !a,
      in: (a, b) => a.includes(b),
      notIn: (a, b) => !a.includes(b),
      contains: (a, b) => a.includes(b),
      notContains: (a, b) => !a.includes(b),
      startsWith: (a, b) => a.startsWith(b),
      endsWith: (a, b) => a.endsWith(b),
      includes: (a, b) => a.includes(b),
      notIncludes: (a, b) => !a.includes(b),
      isEmpty: (a) => a.length === 0,
      isNotEmpty: (a) => a.length > 0,
      isNull: (a) => a === null,
      isNotNull: (a) => a !== null,
      isUndefined: (a) => a === undefined,
      isNotNull: (a) => a !== undefined,
      isNullOrUndefined: (a) => a === null || a === undefined,
      isNotNullOrUndefined: (a) => a !== null && a !== undefined,
      isTrue: (a) => a === true,
      isFalse: (a) => a === false,
      isBoolean: (a) => typeof a === "boolean",
      isNumber: (a) => typeof a === "number",
      isString: (a) => typeof a === "string",
      isArray: (a) => Array.isArray(a),
      isObject: (a) => typeof a === "object" && a !== null,
      isFunction: (a) => typeof a === "function",
      isDate: (a) => a instanceof Date,
      isRegExp: (a) => a instanceof RegExp,
      isError: (a) => a instanceof Error,
      isSymbol: (a) => typeof a === "symbol",
      isBigInt: (a) => typeof a === "bigint",
      isNullOrUndefined: (a) => a === null || a === undefined,
      isNotNullOrUndefined: (a) => a !== null && a !== undefined,
      isTrue: (a) => a === true,
      isFalse: (a) => a === false,
      isBoolean: (a) => typeof a === "boolean",
      isNumber: (a) => typeof a === "number",
      isString: (a) => typeof a === "string",       
      formatPrice: (price) => price.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
  })
); // handlebars
app.set("view engine", "hbs"); // handlebars
app.set("views", path.join(__dirname, "views")); // handlebars

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Bootstrap assets and public directory
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "node_modules", "bootstrap", "dist"))
);
app.use(express.static(path.join(__dirname, "public")));

app.use(viewContext); // middleware dùng để lấy thông tin người dùng từ JWT cookie, và gắn nó vào res.locals

////////////////////////////////////////////////////////////// Web route to render a sample home page //////////////////////////////////////////////////////////////
app.get("/home", async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    const filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice && !isNaN(Number(minPrice))) filter.price.$gte = Number(minPrice);
      if (maxPrice && !isNaN(Number(maxPrice))) filter.price.$lte = Number(maxPrice);
      if (Object.keys(filter.price).length === 0) delete filter.price;
    }

    const [categories, products] = await Promise.all([
      Product.distinct("category"),
      Product.find(filter).lean(),
    ]);

    res.render("home", {
      title: "Trang chủ",
      products,
      categories,
      selectedCategory: category || "all",
      minPrice: minPrice || "",
      maxPrice: maxPrice || "",
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Lỗi server!" });
  }
});

// Render Register page
app.get("/register", (req, res) => {
  res.render("auth/register", { title: "Đăng ký" });
});

// Render Login page
app.get("/login", (req, res) => {
  res.render("auth/login", { title: "Đăng nhập" });
});

app.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    res.render("product", { title: "Sản phẩm", product });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Lỗi server!" });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use("/api/products", productRoute);
app.use("/api/auth", authRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/admin", adminRoute);

app.listen(process.env.PORT || 3000, () => {
  console.log(`✅ Server running on port ${process.env.PORT || 3000}`);
});
