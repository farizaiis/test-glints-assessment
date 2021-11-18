'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('dataItems', [
      {
        name: "Aqua",
        price: 2500,
        stock: 56,
        category: "Minuman",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Shampoo Lifeboy",
        price: 6000,
        stock: 56,
        category: "MCK",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Paku Payung",
        price: 500,
        stock: 1000,
        category: "Perkakas",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cheetoz",
        price: 1500,
        stock: 120,
        category: "Snack",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Mizone",
        price: 4500,
        stock: 80,
        category: "Minuman",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Sabun Lifeboy",
        price: 4000,
        stock: 99,
        category: "MCK",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Semen",
        price: 60000,
        stock: 40,
        category: "Perkakas",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Mie Remes",
        price: 500,
        stock: 200,
        category: "Snack",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Anggur Merah",
        price: 58000,
        stock: 56,
        category: "Minuman",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Shampoo Kuda",
        price: 10000,
        stock: 56,
        category: "MCK",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Aci",
        price: 5000,
        stock: 1000,
        category: "Perkakas",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Kacang Goreng",
        price: 1000,
        stock: 120,
        category: "Snack",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Intisari",
        price: 48000,
        stock: 56,
        category: "Minuman",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Shampoo Sunsilk",
        price: 6000,
        stock: 56,
        category: "MCK",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Paku Bumi",
        price: 20000,
        stock: 1000,
        category: "Perkakas",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Kuaci",
        price: 1500,
        stock: 120,
        category: "Snack",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('dataItems', null, {});
  }
};
