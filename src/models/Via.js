const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db/database');

class Via extends Model {}
Via.init({
    viaId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    viaName: DataTypes.STRING
}, {
    timestamps: false,
    sequelize,
    modelName: "Vias"
});

module.exports = Via;
 