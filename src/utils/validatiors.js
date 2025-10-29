const { body, validationResult } = require("express-validator");

// validation schemas for register
const registerValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Email không hợp lệ"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải ít nhất 6 ký tự")
    .matches(/[A-Z]/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 chữ hoa")
    .matches(/[0-9]/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 số"),
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("Tên không được để trống")
    .isLength({ min: 2 })
    .withMessage("Tên phải ít nhất 2 ký tự"),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Họ không được để trống")
    .isLength({ min: 2 })
    .withMessage("Họ phải ít nhất 2 ký tự"),
];

// Validation schema for login
const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Email không hợp lệ"),
  body("password").notEmpty().withMessage("Mật khẩu không được để trống"),
];

// validation schema for creating product
const createProductValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên sản phẩm không được để trống")
    .isLength({ min: 3 })
    .withMessage("Tên sản phẩm phải ít nhất 3 ký tự"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Mô tả không được để trống")
    .isLength({ min: 10 })
    .withMessage("Mô tả phải ít nhất 10 ký tự"),
  body("price").isFloat({ min: 0 }).withMessage("Giá phải lớn hơn 0"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Danh mục không được để trống"),
  body("stock").isInt({ min: 0 }).withMessage("Kho phải là số nguyên >= 0"),
  body("discount")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Giảm giá phải từ 0-100"),
];

// validation schema for creating shop
const createShopValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên shop không được để trống")
    .isLength({ min: 3, max: 100 })
    .withMessage("Tên shop từ 3-100 ký tự"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Mô tả tối đa 500 ký tự"),
];

// validation schema for creating review
const createReviewValidation = [
  body("productId").isUUID().withMessage("Product ID không hợp lệ"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating phải từ 1-5"),
  body("title")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Tiêu đề tối đa 200 ký tự"),
  body("content")
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Nội dung từ 10-2000 ký tự"),
];

// validation schema for creating order
const createOrderValidation = [
  body("shippingAddress")
    .trim()
    .notEmpty()
    .withMessage("Địa chỉ giao không được để trống")
    .isLength({ min: 10 })
    .withMessage("Địa chỉ phải ít nhất 10 ký tự"),
  body("shippingFee")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Phí vận chuyển phải >= 0"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Ghi chú tối đa 500 ký tự"),
];

// validation schema for adding to cart
const addToCartValidation = [
  body("productId").isUUID().withMessage("Product ID không hợp lệ"),
  body("quantity")
    .isInt({ min: 1, max: 10000 })
    .withMessage("Số lượng từ 1-10000"),
];

// validation schema for search
const searchValidation = [
  body("q")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Từ khoá tìm kiếm từ 2-100 ký tự"),
];

module.exports = {
  registerValidation,
  loginValidation,
  createProductValidation,
  createShopValidation,
  createReviewValidation,
  createOrderValidation,
  addToCartValidation,
  searchValidation,
};
