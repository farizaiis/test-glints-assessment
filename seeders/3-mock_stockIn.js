'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('stockInItems', [
      {
        dataItemId: 1,
        stock: 20,
        date: "2020-12-03",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 40,
        date: "2021-01-08",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 25,
        date: "2021-01-12",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 30,
        date: "2021-02-11",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 32,
        date: "2021-07-02",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 39,
        date: "2021-09-11",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 46,
        date: "2021-10-12",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 32,
        date: "2021-11-12",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 50,
        date: "2021-11-13",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 34,
        date: "2021-11-14",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 47,
        date: "2021-11-15",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 33,
        date: "2021-11-16",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 2,
        stock: 30,
        date: "2021-11-16",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 2,
        stock: 30,
        date: "2021-11-14",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 2,
        stock: 80,
        date: "2021-11-15",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 2,
        stock: 30,
        date: "2021-02-16",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 2,
        stock: 30,
        date: "2021-10-14",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 2,
        stock: 80,
        date: "2021-09-15",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 3,
        stock: 30,
        date: "2021-11-16",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 3,
        stock: 30,
        date: "2021-11-14",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 3,
        stock: 80,
        date: "2021-11-15",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 4,
        stock: 30,
        date: "2021-11-16",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 4,
        stock: 30,
        date: "2021-11-14",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 4,
        stock: 80,
        date: "2021-11-15",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 5,
        stock: 30,
        date: "2021-11-16",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 5,
        stock: 30,
        date: "2021-11-14",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 5,
        stock: 80,
        date: "2021-11-15",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 6,
        stock: 30,
        date: "2021-11-16",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 6,
        stock: 30,
        date: "2021-11-14",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 6,
        stock: 80,
        date: "2021-11-15",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('stockInItems', null, {});
  }
};