const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class Unit extends Model {}
Unit.init({
    unitId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    unitName: DataTypes.STRING,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE 

}, {
    sequelize,
    modelName: "Units"
});

module.exports = Unit;