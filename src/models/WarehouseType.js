const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class WarehouseType extends Model {}
WarehouseType.init({
    warehouseTypeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
      },
    warehouseTypeName: DataTypes.STRING,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE 

}, {
    sequelize,
    modelName: "WarehouseTypes"
});

module.exports = WarehouseType;