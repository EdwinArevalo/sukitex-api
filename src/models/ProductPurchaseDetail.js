const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class ProductPurchaseDetail extends Model {}
ProductPurchaseDetail.init({
    productPurchaseDetailId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    productPurchaseId: DataTypes.INTEGER,
    productStockId: DataTypes.INTEGER,
    productQuantity: DataTypes.INTEGER,
    detailTotal: DataTypes.DECIMAL, 
    productStockRecordId: DataTypes.INTEGER,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE
}, {
    sequelize,
    modelName: "ProductPurchaseDetails"
});

module.exports = ProductPurchaseDetail;