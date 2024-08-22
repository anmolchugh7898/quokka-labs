module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('source_verification', {
          id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true,
          },
          source: {
              type: Sequelize.STRING(255),
              allowNull: false,
              index: true,
          },
          verified: {
              type: Sequelize.BOOLEAN,
              defaultValue: true,
              index: true,
          },
          created_at: {
              type: Sequelize.DATE,
              defaultValue: Sequelize.NOW,
              allowNull: false,
          },
      });
  },

  down: async (queryInterface) => {
      await queryInterface.dropTable('source_verification');
  },
};
