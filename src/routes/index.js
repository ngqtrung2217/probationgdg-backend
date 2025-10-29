const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const shopRoutes = require("./shopRoutes");
const cartRoutes = require("./cartRoutes");
const orderRoutes = require("./orderRoutes");
const reviewRoutes = require("./reviewRoutes");
const trendRoutes = require("./trendRoutes");

const router = express.Router();

// API Routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/shops", shopRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);
router.use("/trends", trendRoutes);

// Health check
router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

module.exports = router;
