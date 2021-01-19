const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class Department extends Model {}
Department.init({
    departmentId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    departmentName: DataTypes.STRING
}, {
    timestamps: false,
    sequelize,
    modelName: "Departments"
});

module.exports = Department;