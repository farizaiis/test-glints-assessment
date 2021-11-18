'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class dataItems extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            dataItems.hasMany(models.stockInItems, {
                as: 'stockinitems',
                foreignKey: 'dataItemId',
            });
            dataItems.hasMany(models.stockOutItems, {
                as: 'stockoutitems',
                foreignKey: 'dataItemId',
            });
        }
    }
    dataItems.init(
        {
            name: DataTypes.STRING,
            stock: DataTypes.INTEGER,
            price: DataTypes.INTEGER,
            category: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'dataItems',
        }
    );
    return dataItems;
};
