"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("Admin123", 10);

    await queryInterface.bulkInsert("Users", [
      {
        id: require("crypto").randomUUID(),
        email: "admin@example.com",
        password: hashedPassword,
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        avatar: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "Users",
      {
        email: "admin@example.com",
      },
      {}
    );
  },
};
