'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Result extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Search }) {
      this.belongsTo(Search, {
        foreignKey: 'search_id',
      })
    }
  }
  Result.init({
    title: DataTypes.STRING,
    videoId: DataTypes.STRING,
    channelId: DataTypes.STRING,
    url: DataTypes.STRING,
    views: DataTypes.STRING,
    likes: DataTypes.STRING,
    comments: DataTypes.STRING,
    subscribers: DataTypes.STRING,
    videos: DataTypes.STRING,
    created: DataTypes.STRING,
    search_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Result',
  });
  return Result;
};
