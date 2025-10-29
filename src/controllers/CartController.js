const { Cart, CartItem, Product } = require("../models");
const { HTTP_STATUS, ERROR_MESSAGES } = require("../config/constants");
const { Op } = require("sequelize");

// get cart by user id
// GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!cart) {
      cart = await Cart.create({ userId });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// add item to cart
// POST /api/cart/items
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // get or create cart
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    // get product information
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
      });
    }

    // Check if product already exists in cart
    const existingItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    let cartItem;
    if (existingItem) {
      // Update quantity
      cartItem = await existingItem.update({
        quantity: existingItem.quantity + quantity,
      });
    } else {
      // Create new item
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
        price: product.price,
      });
    }

    // Update cart totals
    await updateCartTotals(cart.id);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: ERROR_MESSAGES.ITEM_ADDED_TO_CART,
      data: cartItem,
    });
  } catch (error) {
    next(error);
  }
};

// update cart totals
// PUT /api/cart/item/:itemId
const updateCartItem = async (cartId) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cartItem = await CartItem.findByPk(itemId);
    if (!cartItem) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.CART_ITEM_NOT_FOUND,
      });
    }

    // delete item if quantity is zero or less
    if (quantity <= 0) {
      await cartItem.destroy();
    } else {
      await cartItem.update({ quantity });
    }

    // recalculate cart totals
    await updateCartTotals(cartItem.cartId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Cart item updated",
    });
  } catch (error) {
    next(error);
  }
};

// delete cart item
// DELETE /api/cart/item/:itemId
const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cartItem = await CartItem.findByPk(itemId);
    if (!cartItem) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const cartId = cartItem.cartId;
    await cartItem.destroy();

    // recalculate cart totals
    await updateCartTotals(cartId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    next(error);
  }
};

// delete cart
// DELETE /api/cart
const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Cart not found",
      });
    }

    await CartItem.destroy({ where: { cartId: cart.id } });
    await cart.update({ totalItems: 0, totalPrice: 0 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    next(error);
  }
};

// helper function to update cart totals
const updateCartTotals = async (cartId) => {
  const items = await CartItem.findAll({ where: { cartId } });

  let totalItems = 0;
  let totalPrice = 0;

  items.forEach((item) => {
    totalItems += item.quantity;
    totalPrice += parseFloat(item.price) * item.quantity;
  });

  await Cart.update({ totalItems, totalPrice }, { where: { id: cartId } });
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
