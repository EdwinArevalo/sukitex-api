const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class SaleDetail extends Model {}
SaleDetail.init({
    saleDetailId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    saleId: DataTypes.INTEGER,
    productStockId: DataTypes.INTEGER,
    productQuantity: DataTypes.INTEGER,
    saleDetailTotal: DataTypes.DECIMAL,
    productStockRecordId: DataTypes.INTEGER,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE
}, {
    sequelize,
    modelName: "SaleDetails"
});

module.exports = SaleDetail;