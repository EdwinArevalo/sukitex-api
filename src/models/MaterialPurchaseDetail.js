const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class MaterialPurchaseDetail extends Model {}
MaterialPurchaseDetail.init({
    materialPurchaseDetailId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    materialPurchaseId: DataTypes.INTEGER,
    materialStockId: DataTypes.INTEGER,
    materialQuantity: DataTypes.INTEGER,
    detailTotal: DataTypes.DECIMAL, 
    materialStockRecordId: DataTypes.INTEGER,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE
}, {
    sequelize,
    modelName: "MaterialPurchaseDetails"
});

module.exports = MaterialPurchaseDetail;