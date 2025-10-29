const { Shop, User, Product } = require("../models");
const {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} = require("../config/constants");
const { Op } = require("sequelize");

// create shop
// POST /api/shops
const createShop = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    // Kiểm tra user đã có shop
    const existingShop = await Shop.findOne({ where: { userId } });
    if (existingShop) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: ERROR_MESSAGES.USER_ALREADY_HAVE_SHOP,
      });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

    const shop = await Shop.create({
      userId,
      name,
      slug,
      description,
      logo: req.files?.logo?.[0]?.secure_url,
      banner: req.files?.banner?.[0]?.secure_url,
    });

    // Update user role to vendor
    await User.update({ role: "vendor" }, { where: { id: userId } });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.SHOP_CREATED,
      data: shop,
    });
  } catch (error) {
    next(error);
  }
};

// GET shop by id
// GET /api/shops/:id
const getShop = async (req, res, next) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findByPk(id, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "email", "firstName", "lastName", "phone"],
        },
        {
          model: Product,
          as: "products",
          attributes: ["id", "name", "price", "rating"],
        },
      ],
    });

    if (!shop) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.SHOP_NOT_FOUND,
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: shop,
    });
  } catch (error) {
    next(error);
  }
};

// get shop by current user
// GET /api/shops/me
const getMyShop = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const shop = await Shop.findOne({
      where: { userId },
      include: [
        {
          model: Product,
          as: "products",
          attributes: ["id", "name", "price", "stock", "sold"],
        },
      ],
    });

    if (!shop) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.USER_DONT_HAVE_SHOP,
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: shop,
    });
  } catch (error) {
    next(error);
  }
};

// update shop
// PUT /api/shops/:id
const updateShop = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const shop = await Shop.findByPk(id);
    if (!shop) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.SHOP_NOT_FOUND,
      });
    }

    // Cập nhật logo/banner nếu có upload
    if (req.files?.logo) {
      shop.logo = req.files.logo[0].secure_url;
    }
    if (req.files?.banner) {
      shop.banner = req.files.banner[0].secure_url;
    }

    await shop.update({
      name: name || shop.name,
      description: description || shop.description,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.SHOP_UPDATED,
      data: shop,
    });
  } catch (error) {
    next(error);
  }
};

// get all shops
// GET /api/shops
const getAllShops = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    const where = { status: "active" };
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    const { count, rows } = await Shop.findAndCountAll({
      where,
      include: [
        { model: User, as: "owner", attributes: ["firstName", "lastName"] },
        { model: Product, as: "products" },
      ],
      offset,
      limit,
      order: [["followers", "DESC"]],
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

module.exports = {
  createShop,
  getShop,
  getMyShop,
  updateShop,
  getAllShops,
};
