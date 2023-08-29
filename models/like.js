'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User,{
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
      this.belongsTo(models.Image, {
        foreignKey: "image_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    }
  }
  Like.init({
    user_id: DataTypes.INTEGER,
    image_id: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};