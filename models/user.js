'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Image,{
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
      this.hasMany(models.Like,{
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    profile_image_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};