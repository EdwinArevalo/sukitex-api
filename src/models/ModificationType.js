const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class ModificationType extends Model {}
ModificationType.init({
    modificationTypeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    modificationTypeName: DataTypes.STRING
}, {
    timestamps:false,
    sequelize,
    modelName: "ModificationTypes"
}); 

module.exports = ModificationType;