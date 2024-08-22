"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
    class users extends Model {
        static associate(models) {
        }
    }

    users.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            first_name: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            phone: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            token: {
                type: DataTypes.STRING(512),
                allowNull: true,
                // Optional: Add an index if needed
            },
            token_expires_at: {
                type: DataTypes.DATE,
                allowNull: true,
                // Optional: Add an index if needed
            },
        },
        {
            sequelize,
            timestamps: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            modelName: "users",
            tableName: "users",
        }
    );
    return users;
};
