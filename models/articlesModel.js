"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class articles extends Model {
        static associate(models) {
            // Define association with the User table
            articles.belongsTo(models.users, {
                foreignKey: 'author_id', // Name of the foreign key column in the Article table
                onDelete: 'CASCADE',    // Define behavior when the referenced User is deleted
                as: 'author_details'
            });
        }
    }

    articles.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
                index: true,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            author_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'users', // Reference to the Users table
                    key: 'id',
                },
                onDelete: 'CASCADE',
                index: true,
            },
        },
        {
            sequelize,
            timestamps: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            modelName: "articles",
            tableName: "articles",
        }
    );
    return articles;
};
