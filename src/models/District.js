const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class District extends Model {}
District.init({
    districtId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    districtName: DataTypes.STRING,
    departmentId: DataTypes.INTEGER
}, {
    timestamps: false,
    sequelize,
    modelName: "Districts"
});

module.exports = District;