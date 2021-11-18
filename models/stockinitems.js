'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class stockInItems extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            stockInItems.belongsTo(models.dataItems, {
                foreignKey: 'dataItemId',
            });
        }
    }
    stockInItems.init(
        {
            dataItemId: DataTypes.INTEGER,
            stock: DataTypes.INTEGER,
            date: DataTypes.DATEONLY,
        },
        {
            sequelize,
            modelName: 'stockInItems',
        }
    );
    return stockInItems;
};
