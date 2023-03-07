// Import model Customer
// import Customer from "../models/Customer.js";
const Customer = require("../models").customer;
const Order = require("../models").order;
const { v4: uuidv4 } = require("uuid");
const { check, validationResult } = require("express-validator");

// Get semua customer
const getCustomers = async (req, res) => {
  try {
    const customer = await Customer.findAll();
    res.send(customer);
  } catch (err) {
    console.log(err);
  }
};

// Get customer berdasarkan id
const getCustomerById = async (req, res) => {
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
    await Customer.create({
      id: uuidv4(),
      name: req.body.name,
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

module.exports = { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer };
