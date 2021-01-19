const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class ProductInventoryAdjustment extends Model {}
ProductInventoryAdjustment.init({
    inventoryAdjustmentId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    productStockId: DataTypes.INTEGER,
    productQuantity: DataTypes.INTEGER,
    adjustmentReasonId: DataTypes.INTEGER,
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
    modelName: "ProductInventoryAdjustments"
});

module.exports = ProductInventoryAdjustment;
