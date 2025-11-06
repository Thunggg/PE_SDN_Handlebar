const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function viewContext(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.locals.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate("cart.product");

    if (!user) {
      res.locals.user = null;
      return next();
    }

    res.locals.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      cartCount: Array.isArray(user.cart)
        ? user.cart.reduce((sum, item) => sum + item.quantity, 0)
        : 0,
    };
  } catch (err) {
    // Bất kỳ lỗi nào từ jwt.verify hoặc DB
    res.locals.user = null;
  }

  next();
};
