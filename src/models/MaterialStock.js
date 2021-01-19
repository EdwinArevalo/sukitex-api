const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class MaterialStock extends Model {}
MaterialStock.init({
    materialStockId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
    warehouseId: DataTypes.INTEGER,
    materialId: DataTypes.INTEGER,
    unitId: DataTypes.INTEGER,
    providerId: DataTypes.INTEGER,
    materialQuantity: DataTypes.INTEGER,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE 

}, {
    sequelize,
    modelName: "MaterialStocks"
});

module.exports = MaterialStock;