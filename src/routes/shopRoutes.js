const express = require("express");
const { body, query } = require("express-validator");
const { ShopController } = require("../controllers");
const {
  authenticate,
  authorize,
  handleValidationErrors,
  uploadMultiple,
  handleUploadError,
} = require("../middlewares");

const router = express.Router();

// GET /api/shops
router.get(
  "/",
  [
    query("search").optional().trim(),
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  handleValidationErrors,
  ShopController.getAllShops
);

// GET /api/shops/my-shop
router.get(
  "/my-shop",
  authenticate,
  authorize(["vendor"]),
  ShopController.getMyShop
);

// GET /api/shops/:id
router.get("/:id", ShopController.getShop);

// POST /api/shops
router.post(
  "/",
  authenticate,
  authorize(["customer", "vendor"]),
  uploadMultiple,
  handleUploadError,
  [
    body("name").trim().notEmpty().withMessage("Tên shop không được để trống"),
    body("description").optional().trim(),
  ],
  handleValidationErrors,
  ShopController.createShop
);

// PUT /api/shops/:id
router.put(
  "/:id",
  authenticate,
  authorize(["vendor", "admin"]),
  uploadMultiple,
  handleUploadError,
  [
    body("name").optional().trim().notEmpty(),
    body("description").optional().trim(),
  ],
  handleValidationErrors,
  ShopController.updateShop
);

module.exports = router;
