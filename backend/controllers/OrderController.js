const { v4: uuidv4 } = require("uuid");
const uuid = require("uuid");
const Order = require("../models").order;
const Customer = require("../models").customer;
const OrderDetail = require("../models").orderdetail;
const { check, validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { logger } = require("./AppLog");
const moment = require("moment-timezone");

// Get semua order
const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    let startDate = req.query.startDate || "2010-01-01";
    // let endDate = moment(req.query.endDate).add(1, "days") || "2099-12-31";
    let endDate = req.query.endDate || "2099-12-31";

    const offset = limit * page;
    const totalRows = await Order.count({
      where: {
        [Op.and]: [
          {
            code: {
              [Op.iLike]: "%" + search + "%",
            },
          },
          {
            date: {
              // [Op.between]: [`2023-02-01`, `2023-02-28`],
              [Op.between]: [startDate, moment(endDate).add(1, "days")],
            },
          },
        ],
      },
      order: [["date", "DESC"]],
    });
    const totalPage = Math.ceil(totalRows / limit);
    const order = await Order.findAll({
      include: [{ model: OrderDetail, as: "orderdetail" }],
      where: {
        [Op.and]: [
          {
            code: {
              [Op.iLike]: "%" + search + "%",
            },
          },
          {
            date: {
              // [Op.between]: [`2023-02-01`, `2023-02-28`],
              [Op.between]: [startDate, moment(endDate).add(1, "days")],
            },
          },
        ],
      },
      offset: offset,
      limit: limit,
      order: [
        ["date", "DESC"],
        ["createdAt", "DESC"],
      ],
    });
    res.json({
      order,
      page,
      limit,
      totalRows,
      totalPage,
    });
  } catch (err) {
    console.log(err);
  }
};

// Get order berdasarkan id
const getOrderById = async (req, res) => {
  if (!uuid.validate(req.params.id)) {
    logger.error(`Order with id '${req.params.id}' not found`, {
      method: req.method,
      url: req.originalUrl,
      status: res.status(400).statusCode,
    });
    return res.status(400).json({ status: "error", message: "Order not found" });
  }

  try {
    // cek order by id
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: OrderDetail, as: "orderdetail" },
        { model: Customer, as: "customer" },
      ],
    });

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
  await check("userId").notEmpty().withMessage("User id is required").run(req);
  await check("customerId").notEmpty().withMessage("Customer id is required").run(req);
  // await check("date").isDate().withMessage("Wrong date format").run(req);

  // jika ada error
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const code = `${req.body.type}-${Date.now()}`;
  const now = moment().tz("Asia/Jakarta"); // buat objek moment baru dengan waktu saat ini dan zona waktu UTC+7 (Asia/Jakarta)
  const dateOnly = now.startOf("day").hour(7); // atur jam menjadi 07:00:00 dan atur bagian waktu yang lebih kecil dari jam menjadi 0
  const timestamp = dateOnly.format("YYYY-MM-DD HH:mm:ssZ");
  const status = "Delivered";

  try {
    await Order.create({
      id: uuidv4(),
      code,
      type: req.body.type,
      date: timestamp,
      // date: req.body.date,
      status,
      userId: req.body.userId,
      customerId: req.body.customerId,
    });
    logger.info(`Order created`, {
      method: req.method,
      url: req.originalUrl,
      status: res.status(200).statusCode,
    });
    res.json({
      message: "Order Created",
    });
  } catch (err) {
    console.log(err);
  }
};

const getLastData = async (req, res) => {
  try {
    const lastData = await Order.findAll({
      limit: 1,
      order: [["createdAt", "DESC"]],
      include: [{ model: OrderDetail, as: "orderdetail" }],
    });
    res.send(lastData[0]);
    console.log(lastData[0].orderdetail.length);
  } catch (error) {
    console.log(error);
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
      logger.info(`Order with id ${req.params.id} deleted`, {
        method: req.method,
        url: req.originalUrl,
        status: res.status(200).statusCode,
      });
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

module.exports = { getOrders, getOrderById, createOrder, updateOrder, deleteOrder, getLastData };
