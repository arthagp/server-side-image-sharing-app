'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Image, {
        through: models.ImageTag,
        foreignKey: "tag_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Tag.init({
    tag_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tag',
  });
  return Tag;
};