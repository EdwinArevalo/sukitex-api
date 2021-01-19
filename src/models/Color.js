const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class Color extends Model {}
Color.init({
    colorId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    colorName: DataTypes.STRING
}, {
    timestamps:false,
    sequelize,
    modelName: "Colors"
});

module.exports = Color;