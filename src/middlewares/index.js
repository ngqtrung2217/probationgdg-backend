const { authenticate, authorize, optionalAuth } = require("./auth");
const { handleValidationErrors } = require("./validation");
const { notFoundHandler, errorHandler } = require("./errorHandler");
const { uploadSingle, uploadMultiple, handleUploadError } = require("./upload");

module.exports = {
  // auth middlewares
  authenticate,
  authorize,
  optionalAuth,

  // validation middleware
  handleValidationErrors,

  // error handling
  notFoundHandler,
  errorHandler,

  // upload middlewares
  uploadSingle,
  uploadMultiple,
  handleUploadError,
};
