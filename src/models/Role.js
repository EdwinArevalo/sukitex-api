const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class Role extends Model {}
Role.init({
    roleId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    roleName: DataTypes.STRING,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE 
}, {
    sequelize,
    modelName: "Roles"
});

module.exports = Role;