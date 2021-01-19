const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class Product extends Model {}
Product.init({
    productId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
    productName: DataTypes.STRING,
    productCategoryId: DataTypes.INTEGER,
    productDescription: DataTypes.STRING,    
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE 

}, {
    sequelize,
    modelName: "Products"
});

module.exports = Product;
