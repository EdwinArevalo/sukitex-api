const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class Warehouse extends Model {}
Warehouse.init({
    warehouseId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    warehouseTypeId: DataTypes.INTEGER,
    warehouseName: DataTypes.STRING,
    warehouseTelephone: DataTypes.STRING,
    warehouseColorCard: DataTypes.STRING,
    addressId: DataTypes.INTEGER,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE 

}, {
    sequelize,
    modelName: "Warehouses"
});


module.exports = Warehouse;