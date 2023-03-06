"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderDetail.belongsTo(models.order, {
        foreignKey: "orderId",
        as: "order",
      });
      OrderDetail.belongsTo(models.product, {
        foreignKey: "productId",
        as: "product",
      });
    }
  }
  OrderDetail.init(
    {
      quantity: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      orderId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "orderdetail",
    }
  );
  return OrderDetail;
};
