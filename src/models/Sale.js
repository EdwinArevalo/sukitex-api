const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class Sale extends Model {}
Sale.init({
    saleId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    clientId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE
}, {
    sequelize,
    modelName: "Sales"
});

module.exports = Sale;