const Supplier = require("../models").supplier;
const Product = require("../models").product;
const Customer = require("../models").customer;
const { v4: uuidv4 } = require("uuid");
const uuid = require("uuid");
const { check, validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { logger } = require("./AppLog");

// Get semua supplier
const getSuppliers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Supplier.count({
      where: {
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
    const supplier = await Supplier.findAll({
      where: {
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
      include: [{ model: Product, as: "product" }],
      order: [["updatedAt", "DESC"]],
    });
    res.json({
      supplier,
      page,
      limit,
      totalRows,
      totalPage,
    });
  } catch (err) {
    console.log(err);
  }
};

// Get supplier berdasarkan id
const getSupplierById = async (req, res) => {
  if (!uuid.validate(req.params.id)) {
    logger.error(`Supplier with id ${req.params.id} not found`, {
      method: req.method,
      url: req.originalUrl,
      status: res.status(400).statusCode,
    });
    return res.status(400).json({ status: "error", message: "Supplier not found" });
  }

  try {
    // mengecek supplier by id
    const supplier = await Supplier.findByPk(req.params.id, {
      include: [{ model: Product, as: "product" }],
    });

    // jika ditemukan
    if (supplier) {
      res.send(supplier);
    } else {
      // jika tidak ditemukan
      return res.status(409).json({
        status: "error",
        message: "supplier not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// Create supplier baru
const createSupplier = async (req, res) => {
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
    await Supplier.create({
      id: uuidv4(),
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
    });

    const supplier = await Supplier.findAll({
      limit: 1,
      order: [["createdAt", "DESC"]],
    });

    await Customer.create({
      id: supplier[0].id,
      name: supplier[0].name,
      type: "supplier",
      phone: supplier[0].phone,
      email: supplier[0].email,
      address: supplier[0].address,
    });

    logger.info(`Supplier created`, {
      method: req.method,
      url: req.originalUrl,
      status: res.status(200).statusCode,
    });

    res.json({
      message: "Supplier Created",
    });
  } catch (err) {
    console.log(err);
  }
};

// Update supplier berdasarkan id
const updateSupplier = async (req, res) => {
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
    const supplier = await Supplier.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // jika ditemukan
    if (supplier == 1) {
      await Customer.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      logger.info(`Supplier with id ${req.params.id} updated`, {
        method: req.method,
        url: req.originalUrl,
        status: res.status(200).statusCode,
      });

      res.json({
        message: "Supplier Updated",
      });
    } else {
      // jika tidak ditemukan
      return res.status(409).json({
        status: "error",
        message: "supplier not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// Delete supplier berdasarkan id
const deleteSupplier = async (req, res) => {
  try {
    await Supplier.destroy({
      where: {
        id: req.params.id,
      },
    });

    await Customer.destroy({
      where: {
        id: req.params.id,
      },
    });

    logger.info(`Supplier with id ${req.params.id} deleted`, {
      method: req.method,
      url: req.originalUrl,
      status: res.status(200).statusCode,
    });

    res.json({
      message: "Supplier Deleted",
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier };
