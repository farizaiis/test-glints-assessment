'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('dataItems', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            stock: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            price: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            category: {
                allowNull: false,
                type: Sequelize.ENUM(
                    'Perkakas',
                    'Sembako',
                    'MCK',
                    'Snack',
                    'Minuman',
                    'Others'
                ),
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('dataItems');
    },
};
