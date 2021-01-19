const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class Client extends Model {}
Client.init({
    clientId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    clientNames: DataTypes.STRING,
    clientSurnames: DataTypes.STRING,
    clientTreatment: DataTypes.STRING,
    clientRuc: DataTypes.STRING,
    clientTelephone: DataTypes.INTEGER,
    clientEmail: DataTypes.STRING,
    addressId: DataTypes.INTEGER,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE 

}, {
    sequelize,
    modelName: "Clients"
});

module.exports = Client;