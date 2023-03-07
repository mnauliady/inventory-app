// Import model Order
// import Order from "../models/Order.js";
const { v4: uuidv4 } = require("uuid");
const Order = require("../models").order;
const OrderDetail = require("../models").orderdetail;
const { check, validationResult } = require("express-validator");

// Get semua order
const getOrders = async (req, res) => {
  try {
    const order = await Order.findAll({
      include: [{ model: OrderDetail, as: "orderdetail" }],
    });
    res.send(order);
  } catch (err) {
    console.log(err);
  }
};

// Get order berdasarkan id
const getOrderById = async (req, res) => {
  try {
    // cek order by id
    const order = await Order.findByPk(req.params.id);
    if (order) {
      res.send(order);
    } else {
      return res.status(409).json({
        status: "error",
        message: "order not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// Create order baru
const createOrder = async (req, res) => {
  // validasi inputan
  await check("code").isLength({ min: 3 }).withMessage("Minimal 3 character").run(req);
  // await check("type").isEmail().withMessage("Wrong email format").run(req);
  await check("date").isLength({ min: 10, max: 13 }).run(req);
  await check("status").notEmpty().withMessage("Address is required").run(req);
  await check("userId").notEmpty().withMessage("Address is required").run(req);
  await check("customerId").notEmpty().withMessage("Address is required").run(req);

  // jika ada error
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  try {
    await Order.create({
      id: uuidv4(),
      code: req.body.code,
      type: req.body.type,
      date: req.body.date,
      status: req.body.status,
      userId: req.body.userId,
      customerId: req.body.customerId,
    });
    res.json({
      message: "Order Created",
    });
  } catch (err) {
    console.log(err);
  }
};

// Update order berdasarkan id
const updateOrder = async (req, res) => {
  try {
    await Order.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.json({
      message: "Order Updated",
    });
  } catch (err) {
    console.log(err);
  }
};

// Delete order berdasarkan id
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (order) {
      res.json({
        message: "Order Deleted",
      });
    } else {
      // jika order tidak ditemukan
      return res.status(409).json({
        status: "error",
        message: "order not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getOrders, getOrderById, createOrder, updateOrder, deleteOrder };
