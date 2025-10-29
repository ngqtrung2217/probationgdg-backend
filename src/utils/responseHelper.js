const { HTTP_STATUS } = require("../config/constants");

/**
 * Helpers return success response
 * @param {number} statusCode
 * @param {string} message
 * @param {object} data
 * @returns {object}
 */
const successResponse = (
  statusCode = HTTP_STATUS.OK,
  message = "Request successful",
  data = null
) => {
  return {
    success: true,
    statusCode,
    message,
    data,
    timestamp: new Date(),
  };
};

/**
 * Helpers return error response
 * @param {number} statusCode
 * @param {string} message
 * @param {any} errors
 * @returns {object}
 */
const errorResponse = (
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  message = "An error occurred",
  errors = null
) => {
  return {
    success: false,
    statusCode,
    message,
    errors,
    timestamp: new Date(),
  };
};

/**
 * Helpers return paginated response
 * @param {number} statusCode
 * @param {string} message
 * @param {array} data
 * @param {object} pagination
 * @returns {object}
 */
const paginatedResponse = (
  statusCode = HTTP_STATUS.OK,
  message = "Success",
  data = [],
  pagination = {}
) => {
  return {
    success: true,
    statusCode,
    message,
    data,
    pagination: {
      total: pagination.total || 0,
      page: pagination.page || 1,
      limit: pagination.limit || 20,
      pages: pagination.pages || 1,
      hasNext: (pagination.page || 1) < (pagination.pages || 1),
      hasPrev: (pagination.page || 1) > 1,
    },
    timestamp: new Date(),
  };
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
};
