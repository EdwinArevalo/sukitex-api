const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class UserRole extends Model {}
UserRole.init({
    userRoleId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    roleId: DataTypes.INTEGER,
    roleName: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE 

}, {
    sequelize,
    modelName: "UserRoles"
});

module.exports = UserRole;