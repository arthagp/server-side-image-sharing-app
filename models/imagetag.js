'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImageTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Tag, {
        foreignKey: "tag_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.belongsTo(models.Image, {
        foreignKey: "image_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  ImageTag.init({
    image_id: DataTypes.INTEGER,
    tag_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ImageTag',
  });
  return ImageTag;
};