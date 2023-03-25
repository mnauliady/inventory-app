const Customer = require("../models").customer;
const Order = require("../models").order;
const db = require("../models/index");
const { v4: uuidv4 } = require("uuid");
const uuid = require("uuid");
const { check, validationResult } = require("express-validator");
const { Op } = require("sequelize");

// Get semua customer
const getCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Customer.count({
      where: {
        type: "customer",
        [Op.or]: [
          {
            name: {
              [Op.iLike]: "%" + search + "%",
            },
          },
          {
            email: {
              [Op.iLike]: "%" + search + "%",
            },
          },
        ],
      },
    });

    const totalPage = Math.ceil(totalRows / limit);
    const customer = await Customer.findAll({
      where: {
        type: "customer",
        [Op.or]: [
          {
            name: {
              [Op.iLike]: "%" + search + "%",
            },
          },
          {
            email: {
              [Op.iLike]: "%" + search + "%",
            },
          },
        ],
      },
      offset: offset,
      limit: limit,
      include: [{ model: Order, as: "order" }],
    });
    res.json({
      customer,
      page,
      limit,
      totalRows,
      totalPage,
    });
  } catch (err) {
    console.log(err);
  }
};

// Get customer berdasarkan id
const getCustomerById = async (req, res) => {
  if (!uuid.validate(req.params.id)) {
    return res.status(400).json({ status: "error", message: "Customer not found" });
  }

  try {
    const customer = await Customer.findByPk(req.params.id);

    // jika ada customer di dalam db
    if (customer) {
      res.send(customer);
    } else {
      return res.status(409).json({
        status: "error",
        message: "customer not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// Create customer baru
const createCustomer = async (req, res) => {
  // validasi inputan
  await check("name").isLength({ min: 3 }).withMessage("Name at least 3 characters").run(req);
  await check("email").isEmail().withMessage("Wrong email format").run(req);
  await check("phone").isLength({ min: 7, max: 13 }).withMessage("Phone number between 7-14 characters").run(req);
  await check("address").notEmpty().withMessage("Address is required").run(req);

  // jika terdapat error
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  try {
    await Customer.create({
      id: uuidv4(),
      name: req.body.name,
      type: "customer",
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
    });
    res.json({
      message: "Customer Created",
    });
  } catch (err) {
    console.log(err);
  }
};

// Update customer berdasarkan id
const updateCustomer = async (req, res) => {
  // validasi inputan
  await check("name").isLength({ min: 3 }).withMessage("Name at least 3 characters").run(req);
  await check("email").isEmail().withMessage("Wrong email format").run(req);
  await check("phone").isLength({ min: 7, max: 13 }).withMessage("Phone number between 7-14 characters").run(req);
  await check("address").notEmpty().withMessage("Address is required").run(req);

  // jika terdapat error
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  try {
    const customer = await Customer.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    // jika id ada di db
    if (customer == 1) {
      res.json({
        message: "Customer Updated",
      });
    } else {
      return res.status(409).json({
        status: "error",
        message: "customer not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// Delete customer berdasarkan id
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.destroy({
      where: {
        id: req.params.id,
      },
    });
    // jika id ada di db
    if (customer) {
      res.json({
        message: "Customer Deleted",
      });
    } else {
      return res.status(409).json({
        status: "error",
        message: "customer not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const getCustomerType = async (req, res) => {
  try {
    let type;
    if (req.params.type == "OUT") {
      type = await Customer.findAll({
        where: { type: "customer" },
      });
    } else {
      type = await db.sequelize.query(
        `SELECT suppliers.* FROM suppliers INNER JOIN products ON suppliers."id" = products."supplierId" GROUP BY suppliers."id"`,
        {
          type: db.sequelize.QueryTypes.SELECT,
        }
      );
    }

    res.send(type);
  } catch {}
};
module.exports = { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer, getCustomerType };
