const Supplier = require("../models").supplier;
const Product = require("../models").product;
const { v4: uuidv4 } = require("uuid");
const uuid = require("uuid");
const { check, validationResult } = require("express-validator");

// Get semua supplier
const getSuppliers = async (req, res) => {
  try {
    const supplier = await Supplier.findAll();
    res.send(supplier);
  } catch (err) {
    console.log(err);
  }
};

// Get supplier berdasarkan id
const getSupplierById = async (req, res) => {
  if (!uuid.validate(req.params.id)) {
    return res.status(400).json({ status: "error", message: "Supplier not found" });
  }

  try {
    // mengecek supplier by id
    const supplier = await Supplier.findByPk(req.params.id);

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
  await check("name").isLength({ min: 3 }).withMessage("Minimal 3 character").run(req);
  await check("email").isEmail().withMessage("Wrong email format").run(req);
  await check("phone").isLength({ min: 10, max: 13 }).run(req);
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
  await check("name").isLength({ min: 3 }).withMessage("Minimal 3 character").run(req);
  await check("email").isEmail().withMessage("Wrong email format").run(req);
  await check("phone").isLength({ min: 10, max: 13 }).run(req);
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
    res.json({
      message: "Supplier Deleted",
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier };
