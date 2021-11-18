'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('stockOutItems', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            dataItemId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'dataItems',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            stock: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            date: {
                allowNull: false,
                type: Sequelize.DATEONLY,
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
        await queryInterface.dropTable('stockOutItems');
    },
};
