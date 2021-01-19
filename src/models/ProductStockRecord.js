const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class ProductStockRecord extends Model {}
ProductStockRecord.init({
    productStockRecordId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    productStockId: DataTypes.INTEGER,
    productBalance: DataTypes.INTEGER,
    modificationTypeId: DataTypes.INTEGER,
    modificationQuantity: DataTypes.INTEGER,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE 

}, {
    sequelize,
    modelName: "ProductStockRecords"
});

module.exports = ProductStockRecord;