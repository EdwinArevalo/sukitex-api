const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class MaterialStockRecord extends Model {}
MaterialStockRecord.init({
    materialStockRecordId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    materialStockId: DataTypes.INTEGER,
    materialBalance: DataTypes.INTEGER,
    modificationTypeId: DataTypes.INTEGER,
    modificationQuantity: DataTypes.INTEGER,
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt:  DataTypes.DATE 

}, {
    sequelize,
    modelName: "MaterialStockRecords"
});

module.exports = MaterialStockRecord;