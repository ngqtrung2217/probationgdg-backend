require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { sequelize } = require("./src/models");
const routes = require("./src/routes");
const { notFoundHandler, errorHandler } = require("./src/middlewares");

const app = express();

// Middlewares

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(logger("dev"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

// DATABASE CONNECTION
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Routes
app.use("/api", routes);

// 404 Handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

module.exports = app;
