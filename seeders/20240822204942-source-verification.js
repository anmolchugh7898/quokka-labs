'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
    await queryInterface.bulkInsert('source_verification', [
      {
        source: 'source-1'
      },
      {
        source: 'source-2'
      },
      {
        source: 'source-3'
      }
    ].map((status, index) => ({ ...status, id: index + 1, created_at: new Date() })), {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('source_verification', null, {});
  }
};
