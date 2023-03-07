"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.category, {
        foreignKey: "categoryId",
        as: "category",
      });
      Product.belongsTo(models.supplier, {
        foreignKey: "supplierId",
        as: "supplier",
      });
      Product.hasMany(models.orderdetail, { as: "orderdetail" });
    }
  }
  Product.init(
    {
      sku: DataTypes.STRING,
      name: DataTypes.STRING,
      url_photo: DataTypes.STRING,
      min_stock: DataTypes.INTEGER,
      status: DataTypes.STRING,
      price: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      supplierId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "product",
    }
  );
  return Product;
};
