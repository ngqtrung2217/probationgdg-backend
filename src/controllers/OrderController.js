const {
  Order,
  OrderItem,
  Cart,
  CartItem,
  Product,
  User,
} = require("../models");
const {
  HTTP_STATUS,
  ERROR_MESSAGES,
  PAGINATION,
  SUCCESS_MESSAGES,
} = require("../config/constants");

// create order from cart
// POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, shippingFee = 0, notes } = req.body;
    const userId = req.user.id;

    // get cart
    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!cart || cart.items.length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.CART_EMPTY,
      });
    }

    // create order
    const orderCode = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;
    const totalAmount = parseFloat(cart.totalPrice) + parseFloat(shippingFee);

    const order = await Order.create({
      userId,
      orderCode,
      totalAmount,
      shippingAddress,
      shippingFee,
      notes,
      status: "pending",
      paymentStatus: "pending",
    });

    // create order items
    const orderItems = cart.items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      totalPrice: item.price * item.quantity,
    }));

    await OrderItem.bulkCreate(orderItems);

    // update product stock
    for (const item of cart.items) {
      await Product.decrement("stock", {
        by: item.quantity,
        where: { id: item.productId },
      });
      await Product.increment("sold", {
        by: item.quantity,
        where: { id: item.productId },
      });
    }

    // delete cart
    await CartItem.destroy({ where: { cartId: cart.id } });
    await cart.update({ totalItems: 0, totalPrice: 0 });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.ORDER_CREATED,
      data: { order, orderItems },
    });
  } catch (error) {
    next(error);
  }
};

// get orders for current user
// GET /api/orders
const getUserOrders = async (req, res, next) => {
  try {
    const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } =
      req.query;
    const userId = req.user.id;
    const offset = (page - 1) * limit;

    const { count, rows } = await Order.findAndCountAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
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

//get order by id
// GET /api/orders/:id
const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["email", "firstName", "lastName", "phone"],
        },
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!order) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.ORDER_NOT_FOUND,
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// update order status (admin)
// PUT /api/admin/orders/:id
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.ORDER_NOT_FOUND,
      });
    }

    await order.update({
      status: status || order.status,
      paymentStatus: paymentStatus || order.paymentStatus,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.ORDER_STATUS_UPDATED,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// cancel order
// PUT /api/orders/:id/cancel
const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: "items" }],
    });

    if (!order) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.ORDER_NOT_FOUND,
      });
    }

    if (order.status !== "pending") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.CANNOT_CANCEL_ORDER,
      });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.increment("stock", {
        by: item.quantity,
        where: { id: item.productId },
      });
      await Product.decrement("sold", {
        by: item.quantity,
        where: { id: item.productId },
      });
    }

    await order.update({ status: "cancelled" });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.ORDER_CANCELLED,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// get all orders (admin)
// GET /api/admin/orders
const getAllOrders = async (req, res, next) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      status,
    } = req.query;
    const offset = (page - 1) * limit;

    const where = status ? { status } : {};

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["email", "firstName", "lastName"],
        },
        { model: OrderItem, as: "items" },
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

module.exports = {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
};
