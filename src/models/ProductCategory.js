const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class ProductCategory extends Model {}
ProductCategory.init({
    productCategoryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
      },
    productCategoryName: DataTypes.STRING,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE 

}, {
    sequelize,
    modelName: "ProductCategories"
});

module.exports = ProductCategory;