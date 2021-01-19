const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class User extends Model {}
User.init({
    userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    userNames: DataTypes.STRING,
    userSurnames: DataTypes.STRING,
    password: DataTypes.STRING,
    userTelephone: DataTypes.INTEGER,
    userEmail: DataTypes.STRING,
    addressId: DataTypes.INTEGER,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE 

}, {
    sequelize,
    modelName: "Users"
});

module.exports = User;