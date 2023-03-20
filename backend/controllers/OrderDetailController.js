const { v4: uuidv4 } = require("uuid");
const OrderDetail = require("../models").orderdetail;
const Order = require("../models").order;
const { check, validationResult } = require("express-validator");

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
    await check("orderId").notEmpty().withMessage("Order id is required").run(req);
    await check("productId").notEmpty().withMessage("Product id is required").run(req);
    await check("productName").notEmpty().withMessage("Product Name id is required").run(req);
    await check("productPrice").notEmpty().withMessage("Product Price id is required").run(req);
    await check("quantity").isNumeric().withMessage("Quantity id is required").run(req);

    // jika ada error
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    // cek tipe dari order
    const checkType = await Order.findOne({ where: { id: req.body.orderId } });
    let quantity = req.body.quantity;

    // jika tipe transakssi keluar atau out maka set quantity menjadi minus
    if (checkType.type == "OUT") {
      quantity = quantity * -1;
    }

    // proses add detail order
    await OrderDetail.create({
      id: uuidv4(),
      orderId: req.body.orderId,
      productId: req.body.productId,
      quantity: quantity,
      productSku: req.body.productSku,
      productName: req.body.productName,
      productPrice: req.body.productPrice,
    });
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
