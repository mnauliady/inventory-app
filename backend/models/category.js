"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.product, { as: "product" });
      // };
    }
  }
  Category.init(
    {
      name: DataTypes.STRING,
      code: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "category",
      // freezeTableName: "Categories",
    },
    {
      freezeTableName: "Categories",
    }
  );
  // const Category = sequelize.define(
  //   "Categories",
  //   {
  //     id: {
  //       allowNull: false,
  //       // autoIncrement: true,
  //       primaryKey: true,
  //       type: DataTypes.UUID,
  //       defaultValue: DataTypes.UUIDV4,
  //     },
  //     name: { type: DataTypes.STRING, allowNull: false },
  //     createdAt: {
  //       field: "created_at",
  //       type: DataTypes.DATE,
  //       allowNull: false,
  //     },
  //     updatedAt: {
  //       field: "updated_at",
  //       type: DataTypes.DATE,
  //       allowNull: true,
  //     },
  //   },
  //   { tableName: "Categories" }
  // );

  // Category.associate = function (models) {
  //   // models.stock is correct
  //   Category.hasMany(models.Product, { as: "product" });
  // };
  return Category;
};
