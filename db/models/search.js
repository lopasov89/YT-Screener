'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Search extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Result }) {
      this.belongsTo(User, {
        foreignKey: 'user_id',
      })
      this.hasMany(Result, {
        foreignKey: 'search_id',
      })
    }
  }
  Search.init({
    query: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    order: DataTypes.STRING,
    link: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Search',
  });
  return Search;
};
