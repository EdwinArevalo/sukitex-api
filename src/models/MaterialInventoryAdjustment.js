const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class MaterialInventoryAdjustment extends Model {}
MaterialInventoryAdjustment.init({
    inventoryAdjustmentId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    materialStockId: DataTypes.INTEGER,
    materialQuantity: DataTypes.INTEGER,
    adjustmentReasonId: DataTypes.INTEGER,
    materialStockRecordId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE 

}, {
    sequelize,
    modelName: "MaterialInventoryAdjustments"
});

module.exports = MaterialInventoryAdjustment;
