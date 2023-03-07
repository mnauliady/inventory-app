// Import model Category
// import Category from "../models/Category.js";
const Category = require("../models").category;
const Product = require("../models").product;
const { v4: uuidv4 } = require("uuid");
const uuid = require("uuid");
const { check, validationResult } = require("express-validator");

// Get semua category
const getCategories = async (req, res) => {
  try {
    const category = await Category.findAll({
      include: [{ model: Product, as: "product" }],
    });
    res.send(category);
  } catch (err) {
    console.log(err);
  }
};

// Get category berdasarkan id
const getCategoryById = async (req, res) => {
  if (!uuid.validate(req.params.id)) {
    return res.status(400).json({ status: "error", message: "Category not found" });
  }

  try {
    const category = await Category.findByPk(req.params.id);

    // mengecek jika category ada
    if (category) {
      // console.log("Category not found");
      res.send(category);
    } else {
      return res.status(400).json({ status: "error", message: "Category not found" });
    }
  } catch (err) {
    console.log(err);
  }
};

// Create category baru
const createCategory = async (req, res) => {
  // validasi inputan
  await check("name").isLength({ min: 3 }).withMessage("Minimal 3 character").run(req);

  // tampilkan jika ada error
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  try {
    // input data ke db
    await Category.create({
      id: uuidv4(),
      name: req.body.name,
    });
    res.json({
      message: "Category Created",
    });
  } catch (err) {
    console.log(err);
  }
};

// Update category berdasarkan id
const updateCategory = async (req, res) => {
  // validasi inputan
  await check("name").isLength({ min: 3 }).withMessage("Minimal 3 character").run(req);

  // tampilkan jika ada error
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  try {
    // update category
    const category = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // jika berhasil update
    if (category == 1) {
      res.json({
        message: "Category Updated",
      });
    } else {
      // jika id tidak ditemukan
      return res.status(409).json({
        status: "error",
        message: "category not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// Delete category berdasarkan id
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    // mengecek jika category ada
    if (category) {
      res.json({
        message: "Category Deleted",
      });
    } else {
      return res.status(409).json({
        status: "error",
        message: "category not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
