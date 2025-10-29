const { Product, Shop, Review } = require("../models");
const {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION,
} = require("../utils/constants");
const { Op } = require("sequelize");

// Get prodcut (pagination, filter, search)
// GET /api/products?page=1&limit=20&search=abc&catefory=abc&minPrice=100&maxPrice=500&shopId=abc
const getProducts = async (req, res, next) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      search,
      category,
      minPrice,
      maxPrice,
      shopId,
    } = req.query;

    const where = { status: "active" };
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (category) where.category = category;
    if (minPrice) where.price[Op.gte] = minPrice;
    if (maxPrice) where.price[Op.lte] = maxPrice;
    if (shopId) where.shopId = shopId;

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        { model: Shop, as: "shop", attributes: ["id", "name", "slug"] },
        { model: Review, as: "reviews", attributes: ["rating"] },
      ],
      offset,
      limit: Math.min(limit, PAGINATION.MAX_LIMIT),
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

// Get product by ID
// GET /api/products/:id
const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        { model: Shop, as: "shop", attributes: ["id", "name", "slug", "logo"] },
        {
          model: Review,
          as: "reviews",
          attributes: ["id", "rating", "title", "content", "createdAt"],
          include: [
            {
              model: require("../models").User,
              as: "user",
              attributes: ["id", "firstName", "lastName", "avatar"],
            },
          ],
        },
      ],
    });

    if (!product) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Create new product
// POST /api/products

const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      discount,
      originalPrice,
    } = req.body;
    const userId = req.user.id;

    const shop = await Shop.findOne({ where: { userId } });
    if (!shop) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.SHOP_NOT_FOUND,
      });
    }

    const slug = name.toLowerCase().replace(/ /g, "-") + "-" + Date.now();
    const images = req.files ? req.files.map((f) => f.secure_url) : [];

    const product = await Product.create({
      shopId: shop.id,
      name,
      slug,
      description,
      price,
      originalPrice: originalPrice || price,
      discount: discount || 0,
      category,
      stock,
      images,
      status: "draft",
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.PRODUCT_CREATED,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// update product
// PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      stock,
      discount,
      status,
      originalPrice,
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
      });
    }

    if (req.files && req.files.length > 0) {
      product.images = req.files.map((f) => f.secure_url);
    }

    await product.update({
      name: name || product.name,
      description: description || product.description,
      price: price || product.price,
      originalPrice: originalPrice || product.originalPrice,
      category: category || product.category,
      stock: stock !== undefined ? stock : product.stock,
      discount: discount !== undefined ? discount : product.discount,
      status: status || product.status,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.PRODUCT_UPDATED,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// delete product
// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
      });
    }

    await product.destroy();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.PRODUCT_DELETED,
    });
  } catch (error) {
    next(error);
  }
};

// search products
// GET /api/products/search?q=
const searchProducts = async (req, res, next) => {
  try {
    const { q, lmit = PAGINATION.DEFAULT_LIMIT } = req.query;

    if (!q || q.length < 2) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.SEARCH_QUERY_TOO_SHORT,
      });
    }

    const products = await Product.findAll({
      where: {
        status: "active",
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } },
        ],
      },
      include: [{ model: Shop, as: "shop", attributes: ["name"] }],
      limit: Math.min(limit, PAGINATION.MAX_LIMIT),
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
};
