const express = require("express");
const { body, query } = require("express-validator");
const { ProductController } = require("../controllers");
const {
  authenticate,
  authorize,
  handleValidationErrors,
  uploadMultiple,
  handleUploadError,
  optionalAuth,
} = require("../middlewares");

const router = express.Router();

// GET /api/products
router.get(
  "/",
  [
    query("search").optional().trim(),
    query("category").optional(),
    query("minPrice").optional().isFloat({ min: 0 }),
    query("maxPrice").optional().isFloat({ min: 0 }),
    query("shopId").optional().isUUID(),
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  handleValidationErrors,
  optionalAuth,
  ProductController.getProducts
);

// GET /api/products/search
router.get(
  "/search",
  [
    query("q").trim().isLength({ min: 2 }),
    query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
  ],
  handleValidationErrors,
  ProductController.searchProducts
);

// GET /api/products/:id
router.get("/:id", optionalAuth, ProductController.getProduct);

// POST /api/products
router.post(
  "/",
  authenticate,
  authorize(["vendor", "admin"]),
  uploadMultiple,
  handleUploadError,
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Tên sản phẩm không được để trống"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Mô tả không được để trống"),
    body("price").isFloat({ min: 0 }).withMessage("Giá phải lớn hơn 0"),
    body("category")
      .trim()
      .notEmpty()
      .withMessage("Danh mục không được để trống"),
    body("stock").isInt({ min: 0 }).withMessage("Kho phải là số nguyên dương"),
    body("discount").optional().isInt({ min: 0, max: 100 }),
  ],
  handleValidationErrors,
  ProductController.createProduct
);

// PUT /api/products/:id
router.put(
  "/:id",
  authenticate,
  authorize(["vendor", "admin"]),
  uploadMultiple,
  handleUploadError,
  [
    body("name").optional().trim().notEmpty(),
    body("price").optional().isFloat({ min: 0 }),
    body("stock").optional().isInt({ min: 0 }),
    body("discount").optional().isInt({ min: 0, max: 100 }),
  ],
  handleValidationErrors,
  ProductController.updateProduct
);

// DELETE /api/products/:id
router.delete(
  "/:id",
  authenticate,
  authorize(["vendor", "admin"]),
  ProductController.deleteProduct
);

module.exports = router;
