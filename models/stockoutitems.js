'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class stockOutItems extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            stockOutItems.belongsTo(models.dataItems, {
                foreignKey: 'dataItemId',
            });
        }
    }
    stockOutItems.init(
        {
            dataItemId: DataTypes.INTEGER,
            stock: DataTypes.INTEGER,
            date: DataTypes.DATEONLY,
        },
        {
            sequelize,
            modelName: 'stockOutItems',
        }
    );
    return stockOutItems;
};
