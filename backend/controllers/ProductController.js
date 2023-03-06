// Import model Product
// import Product from "../models/Product.js";
const Product = require("../models").product;
const Supplier = require("../models").supplier;
const Category = require("../models").category;
const OrderDetail = require("../models").orderdetail;
const { check, validationResult } = require("express-validator");
// include node fs module
var fs = require("fs");

// Get semua product
const getProducts = async (req, res) => {
  try {
    const product = await Product.findAll();
    res.send(product);
  } catch (err) {
    console.log(err);
  }
};

// Get product berdasarkan id
const getProductById = async (req, res) => {
  try {
    // mengecek jika product pada db by id
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Supplier, as: "supplier" },
        { model: Category, as: "category" },
      ],
    });

    // jika product ada
    if (product) {
      res.send(product);
    } else {
      return res.status(409).json({
        status: "error",
        message: "product not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// Create product baru
const createProduct = async (req, res) => {
  // validasi inputan
  await check("sku").notEmpty().withMessage("sku is required").run(req);
  await check("name").isLength({ min: 3 }).withMessage("minimal 3 character").run(req);
  await check("min_stock").notEmpty().isNumeric().withMessage("Minimal stock is required").run(req);
  await check("categoryId").notEmpty().withMessage("Category ID is required").run(req);
  await check("supplierId").notEmpty().withMessage("Supplier ID required").run(req);

  // tampilkan jika ada error
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const sku = `${req.body.sku}-${Date.now()}`;

  try {
    // input ke dalam db
    await Product.create({
      sku: sku,
      name: req.body.name,
      url_photo: req.file.filename,
      min_stock: req.body.min_stock,
      categoryId: req.body.categoryId,
      supplierId: req.body.supplierId,
    });
    // pesan sukses
    res.json({
      message: "Product Created",
    });
  } catch (err) {
    console.log(err);
  }
};

// Update product berdasarkan id
const updateProduct = async (req, res) => {
  try {
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.json({
      message: "Product Updated",
    });
  } catch (err) {
    console.log(err);
  }
};

// fungsi untuk menghapus file pada storage
const deleteFile = (fileName) => {
  // delete file in public/image folder
  fs.unlink(`./public/images/${fileName}`, function (err) {
    if (err) throw err;
    // if no error, file has been deleted successfully
    console.log("File deleted!");
  });
};

// Delete product berdasarkan id
const deleteProduct = async (req, res) => {
  try {
    // cek apakah id yg diinputkan ada di db
    const getFile = await Product.findByPk(req.params.id);

    // jjika ada
    if (getFile) {
      // hapus data pada db
      await Product.destroy({
        where: {
          id: req.params.id,
        },
      });
      // memanggil fungsi delete file untuk hapus data di storage
      deleteFile(getFile.url_photo);
      //mengirimkan pesan sukses
      res.json({
        message: "Product Deleted",
      });
    } else {
      // jika id tidak ditemukan
      return res.status(409).json({
        status: "error",
        message: "product not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
