"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class source_verification extends Model {
        static associate(models) {
            // Define associations here if needed
        }
    }

    source_verification.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            source: {
                type: DataTypes.STRING(255),
                allowNull: false,
                index: true,
            },
            request_ip: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                index: true,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
        },
        {
            sequelize,
            timestamps: false,
            paranoid: true,
            modelName: "source_verification",
            tableName: "source_verification",
        }
    );
    return source_verification;
};
