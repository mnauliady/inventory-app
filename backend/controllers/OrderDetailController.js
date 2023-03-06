// Import model OrderDetail
// import OrderDetail from "../models/OrderDetail.js";
const OrderDetail = require("../models").orderdetail;

// Get semua orderdetail
const getOrderDetails = async (req, res) => {
  try {
    const orderdetail = await OrderDetail.findAll();
    res.send(orderdetail);
  } catch (err) {
    console.log(err);
  }
};

// Get orderdetail berdasarkan id
const getOrderDetailById = async (req, res) => {
  try {
    const orderdetail = await OrderDetail.findByPk(req.params.id);
    if (orderdetail) {
      res.send(orderdetail);
    } else {
      return res.status(409).json({
        status: "error",
        message: "order detail not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// Create orderdetail baru
const createOrderDetail = async (req, res) => {
  try {
    await OrderDetail.create(req.body);
    res.json({
      message: "Order Detail Created",
    });
  } catch (err) {
    console.log(err);
  }
};

// Update orderdetail berdasarkan id
const updateOrderDetail = async (req, res) => {
  try {
    await OrderDetail.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.json({
      message: "Order Detail Updated",
    });
  } catch (err) {
    console.log(err);
  }
};

// Delete orderdetail berdasarkan id
const deleteOrderDetail = async (req, res) => {
  try {
    const orderdetail = await OrderDetail.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (orderdetail) {
      res.json({
        message: "Order Detail Deleted",
      });
    } else {
      return res.status(409).json({
        status: "error",
        message: "order detail not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getOrderDetails, getOrderDetailById, createOrderDetail, updateOrderDetail, deleteOrderDetail };
