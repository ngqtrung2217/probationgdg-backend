const { HTTP_STATUS, ERROR_MESSAGES } = require("../config/constants");

// xu ly not found
const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
};

// middleware xu ly loi
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // loi sequelize - duplicate key
  if (err.name === "SequelizeUniqueConstraintError") {
    const field = Object.keys(err.fields)[0];
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // loi sequelize - validation error
  if (err.name === "SequelizeValidationError") {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // loi jwt
  if (err.name === "JsonWebTokenError") {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_TOKEN,
    });
  }

  // loi serrver
  res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || ERROR_MESSAGES.INTERNAL_ERROR,
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
