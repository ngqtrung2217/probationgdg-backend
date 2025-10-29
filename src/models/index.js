const { Sequelize } = require("sequelize");
const dbConfig = require("../config/database");

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    ...(dbConfig.ssl && {
      ssl: dbConfig.ssl,
      dialectOptions: dbConfig.dialectOptions,
    }),
  }
);

const User = require("./User");
const Product = require("./Product");
const Shop = require("./Shop");
const Cart = require("./Cart");
const CartItem = require("./CartItem");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Review = require("./Review");
const Trend = require("./Trend");

const models = {
  User: User(sequelize),
  Product: Product(sequelize),
  Shop: Shop(sequelize),
  Cart: Cart(sequelize),
  CartItem: CartItem(sequelize),
  Order: Order(sequelize),
  OrderItem: OrderItem(sequelize),
  Review: Review(sequelize),
  Trend: Trend(sequelize),
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  ...models,
};
