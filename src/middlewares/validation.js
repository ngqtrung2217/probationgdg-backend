const { validationResult } = require("express-validator");
const { HTTP_STATUS } = require("../config/constants");

/**
 * middleware kiem tra loi validation
 * Neu co loi thi tra ve 422
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
    }));

    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: "Validation failed",
      errors: messages,
    });
  }

  next();
};

module.exports = {
  handleValidationErrors,
};
