const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class Material extends Model {}
Material.init({
    materialId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    materialName: DataTypes.STRING,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE 

}, {
    sequelize,
    modelName: "Materials"
});

module.exports = Material;