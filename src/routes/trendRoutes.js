const express = require("express");
const { body, query } = require("express-validator");
const { TrendController } = require("../controllers");
const {
  authenticate,
  authorize,
  handleValidationErrors,
  uploadSingle,
  handleUploadError,
  optionalAuth,
} = require("../middlewares");

const router = express.Router();

// GET /api/trends
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("category").optional().trim(),
  ],
  handleValidationErrors,
  optionalAuth,
  TrendController.getTrends
);

// GET /api/trends/:id
router.get("/:id", optionalAuth, TrendController.getTrend);

// POST /api/trends
router.post(
  "/",
  authenticate,
  authorize(["vendor", "admin"]),
  uploadSingle,
  handleUploadError,
  [
    body("productId").isUUID().withMessage("Product ID không hợp lệ"),
    body("title").trim().notEmpty().withMessage("Tiêu đề không được để trống"),
    body("description").optional().trim(),
    body("category").optional().trim(),
    body("priority").optional().isInt({ min: 0 }),
    body("startDate").optional().isISO8601(),
    body("endDate").optional().isISO8601(),
  ],
  handleValidationErrors,
  TrendController.createTrend
);

// PUT /api/trends/:id
router.put(
  "/:id",
  authenticate,
  authorize(["vendor", "admin"]),
  uploadSingle,
  handleUploadError,
  [
    body("title").optional().trim().notEmpty(),
    body("priority").optional().isInt({ min: 0 }),
    body("isActive").optional().isBoolean(),
  ],
  handleValidationErrors,
  TrendController.updateTrend
);

// DELETE /api/trends/:id
router.delete(
  "/:id",
  authenticate,
  authorize(["vendor", "admin"]),
  TrendController.deleteTrend
);

// POST /api/trends/:id/click
router.post("/:id/click", TrendController.trackTrendClick);

module.exports = router;
