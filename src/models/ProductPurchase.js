const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class ProductPurchase extends Model {}
ProductPurchase.init({
    productPurchaseId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    providerId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE
}, {
    sequelize,
    modelName: "ProductPurchases"
});

module.exports = ProductPurchase;