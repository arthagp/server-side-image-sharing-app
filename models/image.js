'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      // define association here
      this.belongsToMany(models.Tag, {
        through: models.ImageTag,
        foreignKey: 'image_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(models.Like, {
        foreignKey: 'image_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Image.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      caption: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
      },
      total_likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Image',
    }
  );
  return Image;
};
