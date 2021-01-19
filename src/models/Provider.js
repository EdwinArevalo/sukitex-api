const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class Provider extends Model {}
Provider.init({
    providerId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    providerNames: DataTypes.STRING,
    providerSurnames: DataTypes.STRING,
    providerTreatment: DataTypes.STRING,
    providerRuc: DataTypes.STRING,
    providerTelephone: DataTypes.INTEGER,
    providerEmail: DataTypes.STRING,
    addressId: DataTypes.INTEGER,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE 

}, {
    sequelize,
    modelName: "Providers"
});

module.exports = Provider;