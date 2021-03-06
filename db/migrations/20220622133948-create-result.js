'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Results', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      videoId: {
        type: Sequelize.STRING
      },
      channelId: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      views: {
        type: Sequelize.STRING
      },
      likes: {
        type: Sequelize.STRING
      },
      comments: {
        type: Sequelize.STRING
      },
      subscribers: {
        type: Sequelize.STRING
      },
      videos: {
        type: Sequelize.STRING
      },
      created: {
        type: Sequelize.STRING
      },
      search_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Searches',
          key: 'id',
        },
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Results');
  }
};
