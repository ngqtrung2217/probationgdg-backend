const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

const USER_ROLES = {
  ADMIN: "admin",
  VENDOR: "vendor",
  CUSTOMER: "customer",
};

const PRODUCT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DRAFT: "draft",
};

const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
};

const RATING = {
  MIN: 1,
  MAX: 5,
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Email hoặc mật khẩu không đúng",
  USER_NOT_FOUND: "Người dùng không tìm thấy",
  EMAIL_ALREADY_EXISTS: "Email đã được đăng ký",
  PRODUCT_NOT_FOUND: "Sản phẩm không tìm thấy",
  SHOP_NOT_FOUND: "Shop không tìm thấy",
  UNAUTHORIZED: "Bạn không có quyền truy cập",
  INVALID_TOKEN: "Token không hợp lệ",
  EXPIRED_TOKEN: "Token đã hết hạn",
  INTERNAL_ERROR: "Lỗi máy chủ nội bộ",
  BAD_REQUEST: "Yêu cầu không hợp lệ",
  WRONG_PASSWORD: "Mật khẩu hiện tại không đúng",
  SEARCH_QUERY_TOO_SHORT: "Truy vấn tìm kiếm quá ngắn",
  SHOP_NAME_TOO_SHORT: "Tên cửa hàng quá ngắn",
  PRODUCT_NAME_TOO_SHORT: "Tên sản phẩm quá ngắn",
  USER_ALREADY_EXISTS: "Người dùng đã tồn tại",
  USER_DONT_HAVE_SHOP: "Người dùng không có cửa hàng",
  REVIEW_NOT_FOUND: "Đánh giá không tìm thấy",
};

const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Đăng nhập thành công",
  REGISTER_SUCCESS: "Đăng ký thành công",
  LOGOUT_SUCCESS: "Đăng xuất thành công",
  PRODUCT_CREATED: "Sản phẩm được tạo thành công",
  PRODUCT_UPDATED: "Sản phẩm được cập nhật thành công",
  PRODUCT_DELETED: "Sản phẩm được xóa thành công",
  PROFILE_UPDATED: "Cập nhật hồ sơ thành công",
  PASSWORD_CHANGED: "Đổi mật khẩu thành công",
  SHOP_CREATED: "Cửa hàng được tạo thành công",
  SHOP_UPDATED: "Cửa hàng được cập nhật thành công",
  REVIEW_CREATED: "Đánh giá được tạo thành công",
  REVIEW_APPROVED: "Đánh giá được phê duyệt thành công",
  REVIEW_REJECTED: "Đánh giá đã bị từ chối",
  REVIEW_DELETED: "Đánh giá đã bị xóa",
  SHOP_DELETED: "Cửa hàng đã bị xóa",
};

module.exports = {
  HTTP_STATUS,
  USER_ROLES,
  PRODUCT_STATUS,
  ORDER_STATUS,
  PAYMENT_STATUS,
  RATING,
  PAGINATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
