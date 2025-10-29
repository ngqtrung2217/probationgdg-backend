const express = require("express");
const { body } = require("express-validator");
const { UserController } = require("../controllers");
const {
  authenticate,
  handleValidationErrors,
  uploadSingle,
  handleUploadError,
} = require("../middlewares");

const router = express.Router();

// get user by id
router.get("/:id", UserController.getUser);

// put user by id
router.put(
  "/:id",
  authenticate,
  uploadSingle,
  handleUploadError,
  [
    body("firstName").optional().trim().notEmpty(),
    body("lastName").optional().trim().notEmpty(),
    body("phone").optional().isMobilePhone("vi-VN"),
  ],
  handleValidationErrors,
  UserController.updateProfile
);

// put /api/users/:id/change-password
router.put(
  "/:id/change-password",
  authenticate,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Mật khẩu cũ không được để trống"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Mật khẩu mới phải ít nhất 6 ký tự"),
  ],
  handleValidationErrors,
  UserController.changePassword
);

module.exports = router;
