const express = require("express");
const { body, query } = require("express-validator");
const { OrderController } = require("../controllers");
const {
  authenticate,
  authorize,
  handleValidationErrors,
} = require("../middlewares");

const router = express.Router();

// GET /api/orders
router.get(
  "/",
  authenticate,
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  handleValidationErrors,
  OrderController.getUserOrders
);

// GET /api/orders/:id
router.get("/:id", authenticate, OrderController.getOrder);

// POST /api/orders
router.post(
  "/",
  authenticate,
  [
    body("shippingAddress")
      .trim()
      .notEmpty()
      .withMessage("Địa chỉ giao không được để trống"),
    body("shippingFee").optional().isFloat({ min: 0 }),
    body("notes").optional().trim(),
  ],
  handleValidationErrors,
  OrderController.createOrder
);

// PUT /api/orders/:id/cancel
router.put("/:id/cancel", authenticate, OrderController.cancelOrder);

// GET /api/admin/orders
router.get(
  "/admin/all",
  authenticate,
  authorize(["admin"]),
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("status")
      .optional()
      .isIn(["pending", "processing", "shipped", "delivered", "cancelled"]),
  ],
  handleValidationErrors,
  OrderController.getAllOrders
);

// PUT /api/admin/orders/:id/status
router.put(
  "/admin/:id/status",
  authenticate,
  authorize(["admin"]),
  [
    body("status").isIn([
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ]),
    body("paymentStatus")
      .optional()
      .isIn(["pending", "completed", "failed", "refunded"]),
  ],
  handleValidationErrors,
  OrderController.updateOrderStatus
);

module.exports = router;
