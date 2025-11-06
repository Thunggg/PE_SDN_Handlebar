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

const app = express();

app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
    defaultLayout: "main",
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

// Web route to render a sample home page
app.get("/home", (req, res) => {
  res.render("home", { title: "Trang chủ" });
});

// Render Register page
app.get("/register", (req, res) => {
  res.render("auth/register", { title: "Đăng ký" });
});

// Render Login page
app.get("/login", (req, res) => {
  res.render("auth/login", { title: "Đăng nhập" });
});

app.use("/api/products", productRoute);
app.use("/api/auth", authRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/admin", adminRoute);

app.listen(process.env.PORT || 3000, () => {
  console.log(`✅ Server running on port ${process.env.PORT || 3000}`);
});
