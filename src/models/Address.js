const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class Address extends Model {}
Address.init({
    addressId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    departmentId: DataTypes.INTEGER,
    districtId: DataTypes.INTEGER,
    viaId: DataTypes.INTEGER,
    addressViaName: DataTypes.STRING,
    addressNumber: DataTypes.INTEGER,
    addressReference: DataTypes.STRING,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE 

}, {
    sequelize,
    modelName: "Addresses"
});

module.exports = Address;