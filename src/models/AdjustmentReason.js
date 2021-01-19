const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class AdjustmentReason extends Model {}
AdjustmentReason.init({
    adjustmentReasonId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    adjustmentReasonName: DataTypes.STRING
}, {
    timestamps:false,
    sequelize,
    modelName: "AdjustmentReasons"
}); 

module.exports = AdjustmentReason;