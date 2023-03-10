// Import model Product
// import Product from "../models/Product.js";
const Product = require("../models").product;
const Supplier = require("../models").supplier;
const Category = require("../models").category;
const OrderDetail = require("../models").orderdetail;
const { v4: uuidv4 } = require("uuid");
const uuid = require("uuid");
const { check, validationResult } = require("express-validator");
const db = require("../models/index");
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
    let product = await db.sequelize.query(
      `SELECT products.*, SUM(orderdetails.quantity) as stock, categories."name" as "category", suppliers."name" as "supplier" FROM orderdetails INNER JOIN products ON products."id" = orderdetails."productId" INNER JOIN categories
      ON products."categoryId" = categories."id" INNER JOIN suppliers ON products."supplierId" = suppliers."id" WHERE
      products."id" = (:id) GROUP BY products."id", categories."id", suppliers."id"`,
      {
        replacements: { id: req.params.id },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    if (product.length !== 0) {
      res.send(product[0]);
    } else if (product.length === 0) {
      product = await db.sequelize.query(
        `SELECT products.*, suppliers."name" as "supplier", categories."name" as "category" FROM products INNER JOIN suppliers ON products."supplierId" = suppliers."id" INNER JOIN categories ON products."categoryId" = categories."id" WHERE products."id" = (:id) `,
        {
          replacements: { id: req.params.id },
          type: db.sequelize.QueryTypes.SELECT,
        }
      );
      res.send(product[0]);
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

const getStockById = async (req, res) => {
  // 1 if (null -> query get by id)
  try {
    const stockById = await db.sequelize.query(
      `SELECT sum(orderdetails.quantity), products."name" FROM orderdetails INNER JOIN products ON orderdetails."productId" = products."id" WHERE products."id" = (:id) GROUP BY products."id"`,
      {
        replacements: { id: req.params.id },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    // console.log(stockById);
    res.send(stockById);
  } catch (error) {
    console.log(error);
  }
};

const getAllStock = async (req, res) => {
  try {
    const sumAll = await db.sequelize.query(
      `SELECT products.sku, products."name", products."id", products.min_stock, sum(orderdetails.quantity) AS "stock" FROM orderdetails RIGHT JOIN products ON orderdetails."productId" = products."id" GROUP BY products."id"`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    // console.log(stockById);
    res.send(sumAll);
  } catch (error) {
    console.log(error);
  }
};

const getAvailableStock = async (req, res) => {
  try {
    const query = await db.sequelize.query(
      `SELECT products.*, sum(orderdetails.quantity) FROM products INNER JOIN orderdetails ON products."id" = orderdetails."productId" GROUP BY products."id" HAVING sum(orderdetails.quantity) > 0`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    res.send(query);
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllStock,
  getStockById,
  getAvailableStock,
};
