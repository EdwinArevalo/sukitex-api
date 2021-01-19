const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class ProductStock extends Model {}
ProductStock.init({
    productStockId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
    warehouseId: DataTypes.INTEGER,
    productVariantId: DataTypes.INTEGER,
    productQuantity: DataTypes.INTEGER,
    productPrice: DataTypes.DECIMAL,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE 

}, {
    sequelize,
    modelName: "ProductStocks"
});

module.exports = ProductStock;