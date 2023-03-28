// Import model Category
// import Category from "../models/Category.js";
const Category = require("../models").category;
const Product = require("../models").product;
const { v4: uuidv4 } = require("uuid");
const uuid = require("uuid");
const { check, validationResult } = require("express-validator");
const db = require("../models/index");
const { Op } = require("sequelize");
const { logger } = require("./AppLog");

// Get semua category
const getCategories = async (req, res) => {
  // const childLogger = log.child();
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Category.count({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: "%" + search + "%",
            },
          },
          {
            code: {
              [Op.iLike]: "%" + search + "%",
            },
          },
        ],
      },
    });
    const totalPage = Math.ceil(totalRows / limit);
    const category = await Category.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: "%" + search + "%",
            },
          },
          {
            code: {
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
      category,
      page,
      limit,
      totalRows,
      totalPage,
    });
  } catch (err) {
    console.log(err);
  }
};

// Get category berdasarkan id
const getCategoryById = async (req, res) => {
  if (!uuid.validate(req.params.id)) {
    logger.error(`Category with id '${req.params.id}' not found`, {
      method: req.method,
      url: req.originalUrl,
      status: res.status(400).statusCode,
    });
    return res.status(400).json({ status: "error", message: "Category not found" });
  }

  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product, as: "product" }],
    });

    // mengecek jika category ada
    if (category) {
      // console.log("Category not found");
      res.send(category);
    } else {
      logger.error(`Category with id '${req.params.id}' not found`, {
        method: req.method,
        url: req.originalUrl,
        status: res.status(400).statusCode,
      });
      return res.status(400).json({ status: "error", message: "Category not found" });
    }
  } catch (err) {
    console.log(err);
  }
};

// Create category baru
const createCategory = async (req, res) => {
  // validasi inputan
  await check("name").isLength({ min: 3 }).withMessage("Category name at least 3 characters").run(req);
  // mengecek email sudah ada di db
  const name = await db.sequelize.query(`SELECT "name" FROM categories WHERE LOWER(name) = (:name)`, {
    replacements: { name: req.body.name.toLowerCase() },
    type: db.sequelize.QueryTypes.SELECT,
  });

  if (name.length) {
    const result = { msg: "Category name already exist", param: "Category Name" };
    return res.status(409).json({
      errors: [result],
    });
  }

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
      code: req.body.name.substring(0, 3).toLowerCase(),
      description: req.body.description,
    });
    logger.info(`Category ${req.body.name} created`, {
      method: req.method,
      url: req.originalUrl,
      status: res.status(200).statusCode,
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
  await check("name").isLength({ min: 3 }).withMessage("Category name at least 3 characters").run(req);

  // mengecek email sudah ada di db
  const name = await db.sequelize.query(`SELECT "name" FROM categories WHERE LOWER(name) = (:name)`, {
    replacements: { name: req.body.name.toLowerCase() },
    type: db.sequelize.QueryTypes.SELECT,
  });

  if (name.length && req.body.name != req.body.oldName) {
    const result = { msg: `Category name "${req.body.name}"  already exist` };
    return res.status(409).json({
      errors: [result],
    });
  }

  // tampilkan jika ada error
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  try {
    // update category
    const category = await Category.update(
      { name: req.body.name, code: req.body.name.substring(0, 3).toLowerCase(), description: req.body.description },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    // jika berhasil update
    if (category == 1) {
      logger.info(`Category with id ${req.params.id} updated`, {
        method: req.method,
        url: req.originalUrl,
        status: res.status(200).statusCode,
      });
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
      logger.info(`Category with id ${req.params.id} deleted`, {
        method: req.method,
        url: req.originalUrl,
        status: res.status(200).statusCode,
      });
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
