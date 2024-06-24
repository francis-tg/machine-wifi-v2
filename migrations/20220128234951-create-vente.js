'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('Ventes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            article_id: {
                type: Sequelize.INTEGER,
                onDelete: "CASCADE",
                allowNull: false,
                references: {
                    model: "Articles",
                    key: "id",
                    as: "article_id",
                },
            },
            pu: {
                type: Sequelize.INTEGER
            },
            quantity: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('Ventes');
    }
};