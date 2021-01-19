const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class Size extends Model {}
Size.init({
    sizeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    sizeName: DataTypes.STRING
}, {
    timestamps:false,
    sequelize,
    modelName: "Sizes"
});

module.exports = Size;