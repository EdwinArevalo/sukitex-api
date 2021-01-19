const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class MaterialTransfer extends Model {}
MaterialTransfer.init({
    materialTransferId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    materialStockId: DataTypes.INTEGER,
    destinationWarehouseId: DataTypes.INTEGER,
    originWarehouseId: DataTypes.INTEGER,
    materialQuantity: DataTypes.INTEGER,
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
    modelName: "MaterialTransfers"
});

module.exports = MaterialTransfer;
