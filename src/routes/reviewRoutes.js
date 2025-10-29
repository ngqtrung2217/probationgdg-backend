const express = require("express");
const { body, query } = require("express-validator");
const { ReviewController } = require("../controllers");
const {
  authenticate,
  authorize,
  handleValidationErrors,
  uploadMultiple,
  handleUploadError,
} = require("../middlewares");

const router = express.Router();

// GET /api/reviews/product/:productId
router.get(
  "/product/:productId",
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  handleValidationErrors,
  ReviewController.getReviewsByProduct
);

// POST /api/reviews
router.post(
  "/",
  authenticate,
  uploadMultiple,
  handleUploadError,
  [
    body("productId").isUUID().withMessage("Product ID không hợp lệ"),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating phải từ 1 đến 5"),
    body("title").optional().trim(),
    body("content").optional().trim(),
  ],
  handleValidationErrors,
  ReviewController.createReview
);

// DELETE /api/reviews/:id
router.delete("/:id", authenticate, ReviewController.deleteReview);

// GET /api/admin/reviews
router.get(
  "/admin/all",
  authenticate,
  authorize(["admin"]),
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("status").optional().isIn(["pending", "approved", "rejected"]),
  ],
  handleValidationErrors,
  ReviewController.getAllReviews
);

// PUT /api/admin/reviews/:id/approve
router.put(
  "/admin/:id/approve",
  authenticate,
  authorize(["admin"]),
  ReviewController.approveReview
);

// PUT /api/admin/reviews/:id/reject
router.put(
  "/admin/:id/reject",
  authenticate,
  authorize(["admin"]),
  ReviewController.rejectReview
);

module.exports = router;
