"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // hasMany => one to many
      // relasi tabel customer ke tabel order
      Customer.hasMany(models.order, { as: "order" });
    }
  }
  Customer.init(
    {
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      type: DataTypes.STRING,
      address: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "customer",
    }
  );
  return Customer;
};
