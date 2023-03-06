"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // belongsTo => many to one
      // hasMany => one to many
      // relasi tabel order ke tabel user
      Order.belongsTo(models.user, {
        foreignKey: "userId",
        as: "user",
      });
      // relasi tabel order ke tabel customer
      Order.belongsTo(models.customer, {
        foreignKey: "customerId",
        as: "customer",
      });
      // relasi tabel order ke tabel orderdetail
      Order.hasMany(models.orderdetail, { as: "orderdetail" });
    }
  }
  Order.init(
    {
      code: DataTypes.STRING,
      type: DataTypes.STRING,
      date: DataTypes.DATE,
      status: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      customerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "order",
    }
  );
  return Order;
};
