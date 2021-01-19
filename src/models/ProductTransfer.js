const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class ProductTransfer extends Model {}
ProductTransfer.init({
    productTransferId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    productStockId: DataTypes.INTEGER,
    destinationWarehouseId: DataTypes.INTEGER,
    originWarehouseId: DataTypes.INTEGER,
    productQuantity: DataTypes.INTEGER,
    productStockRecordId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE 

}, {
    sequelize,
    modelName: "ProductTransfers"
});

module.exports = ProductTransfer;
