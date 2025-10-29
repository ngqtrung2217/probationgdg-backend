const { Trend, Product } = require("../models");
const {
  HTTP_STATUS,
  ERROR_MESSAGES,
  PAGINATION,
} = require("../config/constants");
const { Op } = require("sequelize");

// get list of trends
// GET /api/trends
const getTrends = async (req, res, next) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      category,
    } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      isActive: true,
      startDate: { [Op.lte]: new Date() },
      [Op.or]: [{ endDate: null }, { endDate: { [Op.gte]: new Date() } }],
    };

    if (category) where.category = category;

    const { count, rows } = await Trend.findAndCountAll({
      where,
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "price", "images"],
        },
      ],
      offset,
      limit,
      order: [
        ["priority", "DESC"],
        ["createdAt", "DESC"],
      ],
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

// get trend by id
// GET /api/trends/:id
const getTrend = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trend = await Trend.findByPk(id, {
      include: [{ model: Product, as: "product" }],
    });

    if (!trend) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.TREND_NOT_FOUND,
      });
    }

    // Tăng view count
    await trend.increment("views");

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: trend,
    });
  } catch (error) {
    next(error);
  }
};

// create new trend
// POST /api/trends
const createTrend = async (req, res, next) => {
  try {
    const {
      productId,
      title,
      description,
      category,
      priority,
      startDate,
      endDate,
    } = req.body;
    const userId = req.user.role === "admin" ? null : req.user.id;

    // Kiểm tra sản phẩm
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
      });
    }

    const trend = await Trend.create({
      productId,
      userId,
      title,
      description,
      category,
      image: req.file?.secure_url,
      priority: priority || 0,
      isActive: true,
      startDate: startDate || new Date(),
      endDate,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.TREND_CREATED,
      data: trend,
    });
  } catch (error) {
    next(error);
  }
};

// update trend
// PUT /api/trends/:id
const updateTrend = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      priority,
      isActive,
      startDate,
      endDate,
    } = req.body;

    const trend = await Trend.findByPk(id);
    if (!trend) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.TREND_NOT_FOUND,
      });
    }

    // Cập nhật ảnh nếu có upload
    if (req.file) {
      trend.image = req.file.secure_url;
    }

    await trend.update({
      title: title || trend.title,
      description: description || trend.description,
      category: category || trend.category,
      priority: priority !== undefined ? priority : trend.priority,
      isActive: isActive !== undefined ? isActive : trend.isActive,
      startDate: startDate || trend.startDate,
      endDate: endDate || trend.endDate,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.TREND_UPDATED,
      data: trend,
    });
  } catch (error) {
    next(error);
  }
};

// delete trend
// DELETE /api/trends/:id
const deleteTrend = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trend = await Trend.findByPk(id);
    if (!trend) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.TREND_NOT_FOUND,
      });
    }

    await trend.destroy();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.TREND_DELETED,
    });
  } catch (error) {
    next(error);
  }
};

// track trend click
// POST /api/trends/:id/click
const trackTrendClick = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trend = await Trend.findByPk(id);
    if (!trend) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.TREND_NOT_FOUND,
      });
    }

    await trend.increment("clicks");

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.TREND_CLICK_TRACKED,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTrends,
  getTrend,
  createTrend,
  updateTrend,
  deleteTrend,
  trackTrendClick,
};
