const { Review, Product, User } = require("../models");
const {
  HTTP_STATUS,
  ERROR_MESSAGES,
  RATING,
  PAGINATION,
  SUCCESS_MESSAGES,
} = require("../config/constants");
const e = require("express");

//create review
// POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, content } = req.body;
    const userId = req.user.id;

    // check product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
      });
    }

    // Check if rating is valid
    if (rating < RATING.MIN || rating > RATING.MAX) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: `Rating must be between ${RATING.MIN} and ${RATING.MAX}`,
      });
    }

    const images = req.files ? req.files.map((f) => f.secure_url) : [];

    const review = await Review.create({
      userId,
      productId,
      rating,
      title,
      content,
      images,
      status: "pending", // waiting for admin approval
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.REVIEW_CREATED,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// get reviews by product
// GET /api/products/:productId/reviews

const getReviewsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } =
      req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Review.findAndCountAll({
      where: {
        productId,
        status: "approved", // only show approved reviews
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "avatar"],
        },
      ],
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// get all reviews (admin)
// GET /api/reviews
const getAllReviews = async (req, res, next) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      status,
    } = req.query;
    const offset = (page - 1) * limit;

    const where = status ? { status } : {};

    const { count, rows } = await Review.findAndCountAll({
      where,
      include: [
        { model: User, as: "user", attributes: ["firstName", "lastName"] },
        { model: Product, as: "product", attributes: ["name"] },
      ],
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// approve review (admin)
// PUT /api/reviews/:id/approve
const approveReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.REVIEW_NOT_FOUND,
      });
    }

    await review.update({ status: "approved" });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.REVIEW_APPROVED,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// reject review (admin)
// PUT /api/reviews/:id/reject
const rejectReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.REVIEW_NOT_FOUND,
      });
    }

    await review.update({ status: "rejected" });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.REVIEW_REJECTED,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// reject review (admin)
// PUT /api/reviews/:id/reject
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.REVIEW_NOT_FOUND,
      });
    }

    await review.destroy();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.REVIEW_DELETED,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getReviewsByProduct,
  getAllReviews,
  approveReview,
  rejectReview,
  deleteReview,
};
