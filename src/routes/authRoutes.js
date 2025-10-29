const express = require("express");
const { body } = require("express-validator");
const { AuthController } = require("../controllers");
const { authenticate, handleValidationErrors } = require("../middlewares");

const router = express.Router();
// POST /api/auth/register
router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
  ],
  handleValidationErrors,
  AuthController.register
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  handleValidationErrors,
  AuthController.login
);

// get /api/auth/me
router.get("/me", authenticate, AuthController.getCurrentUser);

// log out POST /api/auth/logout
router.post("/logout", authenticate, AuthController.logout);

module.exports = router;
