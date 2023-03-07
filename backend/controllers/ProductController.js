// Import model Product
// import Product from "../models/Product.js";
const Product = require("../models").product;
const Supplier = require("../models").supplier;
const Category = require("../models").category;
const OrderDetail = require("../models").orderdetail;
const { v4: uuidv4 } = require("uuid");
const uuid = require("uuid");
const { check, validationResult } = require("express-validator");
// include node fs module
var fs = require("fs");

// Get semua product
const getProducts = async (req, res) => {
  try {
    const product = await Product.findAll({
      where: { status: "active" },
    });
    res.send(product);
  } catch (err) {
    console.log(err);
  }
};

// Get product berdasarkan id
const getProductById = async (req, res) => {
  if (!uuid.validate(req.params.id)) {
    return res.status(400).json({ status: "error", message: "Product not found" });
  }

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
  await check("price").notEmpty().isNumeric().withMessage("Price is required").run(req);
  await check("categoryId").notEmpty().withMessage("Category ID is required").run(req);
  await check("supplierId").notEmpty().withMessage("Supplier ID required").run(req);

  // tampilkan jika ada error
  const result = validationResult(req);
  if (!result.isEmpty()) {
    // jika ada error hapus file gambar
    // karena file gambar terlebih dahulu disimpan sebelum data masuk ke db
    deleteFile(req.file.filename);
    return res.status(400).json({ errors: result.array() });
  }

  const sku = `${req.body.sku}-${Date.now()}`;

  try {
    // input ke dalam db
    await Product.create({
      id: uuidv4(),
      sku: sku,
      name: req.body.name,
      status: "active",
      url_photo: req.file.filename,
      price: req.body.price,
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

// Delete product berdasarkan id
// const deleteProduct = async (req, res) => {
//   try {
//     // cek apakah id yg diinputkan ada di db
//     const getFile = await Product.findByPk(req.params.id);

//     // jika ada
//     if (getFile) {
//       // hapus data pada db
//       await Product.destroy({
//         where: {
//           id: req.params.id,
//         },
//       });

//       // memanggil fungsi delete file untuk hapus data di storage
//       deleteFile(getFile.url_photo);
//       //mengirimkan pesan sukses
//       res.json({
//         message: "Product Deleted",
//       });
//     } else {
//       // jika id tidak ditemukan
//       return res.status(409).json({
//         status: "error",
//         message: "product not found",
//       });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

// Delete product berdasarkan id (hanya mengupdate status product menjadi 'not active')
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.update(
      {
        status: "not active",
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    // mengecek jika product ada
    if (product == 1) {
      res.json({
        message: "Category Deleted",
      });
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

// fungsi untuk menghapus file pada storage
const deleteFile = (fileName) => {
  // delete file in public/image folder
  fs.unlink(`./public/images/${fileName}`, function (err) {
    if (err) throw err;
    // if no error, file has been deleted successfully
    console.log("File deleted!");
  });
};
module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
