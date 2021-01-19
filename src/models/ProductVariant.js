const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class ProductVariant extends Model {}
ProductVariant.init({
    productVariantId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
    productId: DataTypes.INTEGER,
    sizeId: DataTypes.INTEGER,
    colorId: DataTypes.INTEGER,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE 

}, {
    sequelize,
    modelName: "ProductVariants"
});

module.exports = ProductVariant;
