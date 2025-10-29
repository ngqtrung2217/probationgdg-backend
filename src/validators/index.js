/**
 * This file contains all validation schemas for API endpoints
 * These schemas are used in routes
 */

const { body, query, param } = require("express-validator");

// Auth Validators

const authValidators = {
  register: [
    body("email").isEmail().normalizeEmail().withMessage("Email không hợp lệ"),
    body("password")
      .isLength({ min: 6 })
      .matches(/[A-Z]/)
      .matches(/[0-9]/)
      .withMessage("Mật khẩu phải có chữ hoa, số, ít nhất 6 ký tự"),
    body("firstName").trim().notEmpty().isLength({ min: 2 }),
    body("lastName").trim().notEmpty().isLength({ min: 2 }),
  ],

  login: [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty(),
  ],
};

// User Validators

const userValidators = {
  updateProfile: [
    body("firstName").optional().trim().notEmpty().isLength({ min: 2 }),
    body("lastName").optional().trim().notEmpty().isLength({ min: 2 }),
    body("phone").optional().isMobilePhone("vi-VN"),
  ],

  changePassword: [
    body("currentPassword").notEmpty(),
    body("newPassword").isLength({ min: 6 }).matches(/[A-Z]/).matches(/[0-9]/),
  ],
};

// Product Validators

const productValidators = {
  create: [
    body("name").trim().notEmpty().isLength({ min: 3, max: 200 }),
    body("description").trim().notEmpty().isLength({ min: 10 }),
    body("price").isFloat({ min: 0 }).toFloat(),
    body("category").trim().notEmpty(),
    body("stock").isInt({ min: 0 }).toInt(),
    body("discount").optional().isInt({ min: 0, max: 100 }).toInt(),
    body("originalPrice").optional().isFloat({ min: 0 }).toFloat(),
  ],

  update: [
    body("name").optional().trim().notEmpty().isLength({ min: 3 }),
    body("price").optional().isFloat({ min: 0 }).toFloat(),
    body("stock").optional().isInt({ min: 0 }).toInt(),
    body("discount").optional().isInt({ min: 0, max: 100 }).toInt(),
  ],

  search: [
    query("q").trim().isLength({ min: 2, max: 100 }),
    query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
  ],

  list: [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("search").optional().trim(),
    query("category").optional(),
    query("minPrice").optional().isFloat({ min: 0 }).toFloat(),
    query("maxPrice").optional().isFloat({ min: 0 }).toFloat(),
  ],
};

// Shop Validators

const shopValidators = {
  create: [
    body("name").trim().notEmpty().isLength({ min: 3, max: 100 }),
    body("description").optional().trim().isLength({ max: 500 }),
  ],

  update: [
    body("name").optional().trim().notEmpty().isLength({ min: 3 }),
    body("description").optional().trim(),
  ],
};

// Cart Validators

const cartValidators = {
  addItem: [
    body("productId").isUUID(),
    body("quantity").isInt({ min: 1, max: 1000 }).toInt(),
  ],

  updateItem: [body("quantity").isInt({ min: 0, max: 1000 }).toInt()],
};

// Order Validators

const orderValidators = {
  create: [
    body("shippingAddress").trim().notEmpty().isLength({ min: 10 }),
    body("shippingFee").optional().isFloat({ min: 0 }).toFloat(),
    body("notes").optional().trim().isLength({ max: 500 }),
  ],

  updateStatus: [
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
};

// Review Validators

const reviewValidators = {
  create: [
    body("productId").isUUID(),
    body("rating").isInt({ min: 1, max: 5 }).toInt(),
    body("title").optional().trim().isLength({ max: 200 }),
    body("content").optional().trim().isLength({ min: 10, max: 2000 }),
  ],
};

// Trend Validators

const trendValidators = {
  create: [
    body("productId").isUUID(),
    body("title").trim().notEmpty().isLength({ min: 3, max: 200 }),
    body("description").optional().trim(),
    body("category").optional().trim(),
    body("priority").optional().isInt({ min: 0 }).toInt(),
    body("startDate").optional().isISO8601(),
    body("endDate").optional().isISO8601(),
  ],

  update: [
    body("title").optional().trim().notEmpty(),
    body("priority").optional().isInt({ min: 0 }).toInt(),
    body("isActive").optional().isBoolean().toBoolean(),
  ],

  list: [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("category").optional().trim(),
  ],
};

module.exports = {
  authValidators,
  userValidators,
  productValidators,
  shopValidators,
  cartValidators,
  orderValidators,
  reviewValidators,
  trendValidators,
};
