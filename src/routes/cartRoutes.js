const express = require("express");
const { body } = require("express-validator");
const { CartController } = require("../controllers");
const { authenticate, handleValidationErrors } = require("../middlewares");

const router = express.Router();

// GET /api/cart
router.get("/", authenticate, CartController.getCart);

// POST /api/cart/items
router.post(
  "/items",
  authenticate,
  [
    body("productId").isUUID().withMessage("Product ID không hợp lệ"),
    body("quantity").isInt({ min: 1 }).withMessage("Số lượng phải ít nhất 1"),
  ],
  handleValidationErrors,
  CartController.addToCart
);

// PUT /api/cart/items/:itemId
router.put(
  "/items/:itemId",
  authenticate,
  [body("quantity").isInt({ min: 0 }).withMessage("Số lượng phải >= 0")],
  handleValidationErrors,
  CartController.updateCartItem
);

// DELETE /api/cart/items/:itemId - Xóa item khỏi giỏ
router.delete("/items/:itemId", authenticate, CartController.removeFromCart);

// DELETE /api/cart - Xóa toàn bộ giỏ hàng
router.delete("/", authenticate, CartController.clearCart);

module.exports = router;
