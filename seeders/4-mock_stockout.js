'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('stockOutItems', [
      {
        dataItemId: 1,
        stock: 4,
        date: "2020-12-03",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 5,
        date: "2021-01-08",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 7,
        date: "2021-01-12",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 8,
        date: "2021-02-11",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 2,
        date: "2021-07-02",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 4,
        date: "2021-09-11",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 6,
        date: "2021-10-12",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 4,
        date: "2021-11-12",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 9,
        date: "2021-11-13",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 2,
        date: "2021-11-14",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 1,
        date: "2021-11-15",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 1,
        stock: 9,
        date: "2021-11-16",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 2,
        stock: 5,
        date: "2021-11-16",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 2,
        stock: 2,
        date: "2021-11-14",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 2,
        stock: 4,
        date: "2021-11-15",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 2,
        stock: 5,
        date: "2021-02-16",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 2,
        stock: 6,
        date: "2021-10-14",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 2,
        stock: 7,
        date: "2021-09-15",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 3,
        stock: 2,
        date: "2021-11-16",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 3,
        stock: 4,
        date: "2021-11-14",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 3,
        stock: 6,
        date: "2021-11-15",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 4,
        stock: 4,
        date: "2021-11-16",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 4,
        stock: 6,
        date: "2021-11-14",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 4,
        stock: 7,
        date: "2021-11-15",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 5,
        stock: 8,
        date: "2021-11-16",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 5,
        stock: 9,
        date: "2021-11-14",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 5,
        stock: 10,
        date: "2021-11-15",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 6,
        stock: 11,
        date: "2021-11-16",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 6,
        stock: 3,
        date: "2021-11-14",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dataItemId: 6,
        stock: 2,
        date: "2021-11-15",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('stockOutItems', null, {});
  }
};
