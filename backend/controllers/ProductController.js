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
const { logger } = require("./AppLog");

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
    logger.error(`Product with id '${req.params.id}' not found`, {
      method: req.method,
      url: req.originalUrl,
      status: res.status(400).statusCode,
    });
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
  // // validasi inputan
  // await check("sku").notEmpty().withMessage("sku is required").run(req);
  await check("name").isLength({ min: 3 }).withMessage("Name at least 3 characters").run(req);
  await check("min_stock").notEmpty().isNumeric().withMessage("Minimal stock is required").run(req);
  await check("price").notEmpty().isNumeric().withMessage("Price is required").run(req);
  await check("categoryId").notEmpty().withMessage("Category is required").run(req);
  await check("supplierId").notEmpty().withMessage("Supplier is required").run(req);

  // tampilkan jika ada error
  const result = validationResult(req);
  if (!result.isEmpty()) {
    // jika ada error hapus file gambar
    // karena file gambar terlebih dahulu disimpan sebelum data masuk ke db
    deleteFile(req.file.filename);
    return res.status(400).json({ errors: result.array() });
  }

  const sku = `${req.body.sku.toLowerCase().replaceAll(" ", "")}-${Date.now()}`;

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
    logger.info(`Product created`, {
      method: req.method,
      url: req.originalUrl,
      status: res.status(200).statusCode,
    });
    res.json({
      message: "Product Created",
    });
  } catch (err) {
    console.log(err);
  }
};

// Update product berdasarkan id
const updateProduct = async (req, res) => {
  // validasi inputan
  await check("name").isLength({ min: 3 }).withMessage("Name at least 3 characters").run(req);
  await check("min_stock").notEmpty().isNumeric().withMessage("Minimal stock is required").run(req);
  await check("price").notEmpty().isNumeric().withMessage("Price is required").run(req);
  await check("categoryId").notEmpty().withMessage("Category is required").run(req);
  await check("supplierId").notEmpty().withMessage("Supplier is required").run(req);

  // tampilkan jika ada error
  const result = validationResult(req);
  if (!result.isEmpty()) {
    // jika ada error hapus file gambar
    // karena file gambar terlebih dahulu disimpan sebelum data masuk ke db
    if (req.file) {
      deleteFile(req.file.filename);
    }
    return res.status(400).json({ errors: result.array() });
  }

  try {
    const query = await Product.findByPk(req.params.id);

    // set nilai photo
    let photo = query.url_photo;
    // set nilai sku
    let sku = query.sku;

    // jika category berubah maka sku juga berubah ()
    if (req.body.categoryId != query.categoryId) {
      sku = `${req.body.sku.toLowerCase().replaceAll(" ", "")}-${Date.now()}`;
    }

    // jika ada data foto baru (update foto)
    if (req.file) {
      // hapus foto lama
      if (query) {
        deleteFile(query.url_photo);
      }
      // set nilai photo menjadi photo baru
      photo = req.file.filename;
    }

    // proses update
    await Product.update(
      {
        sku,
        name: req.body.name,
        url_photo: photo,
        status: req.body.status,
        price: req.body.price,
        min_stock: req.body.min_stock,
        categoryId: req.body.categoryId,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    logger.info(`Product with id ${req.params.id} updated`, {
      method: req.method,
      url: req.originalUrl,
      status: res.status(200).statusCode,
    });
    res.json({
      message: "Product Updated",
    });
  } catch (err) {
    console.log(err);
  }
};

// Delete product berdasarkan id (hanya mengupdate status product menjadi 'not active')
const deleteProduct = async (req, res) => {
  try {
    const query = await Product.findByPk(req.params.id, {
      include: [{ model: OrderDetail, as: "orderdetail" }],
    });

    if (!query.orderdetail.length) {
      // hapus data pada db
      await Product.destroy({
        where: {
          id: req.params.id,
        },
      });

      // memanggil fungsi delete file untuk hapus data di storage
      deleteFile(query.url_photo);
      logger.info(`Product with id ${req.params.id} deleted`, {
        method: req.method,
        url: req.originalUrl,
        status: res.status(200).statusCode,
      });
      //mengirimkan pesan sukses
      res.json({
        message: "Product Deleted",
      });
    }

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
    logger.info(`Product with id ${req.params.id} set to not active`, {
      method: req.method,
      url: req.originalUrl,
      status: res.status(200).statusCode,
    });
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
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const status = req.query.status || "";
    const offset = limit * page;
    console.log(req.query);
    const query = await db.sequelize.query(
      `SELECT products.*, sum(orderdetails.quantity) AS stock FROM orderdetails RIGHT JOIN products ON orderdetails."productId" = products."id" WHERE(products.sku ILIKE '%${search}%' OR products."name" ILIKE '%${search}%' OR products."status" = '${status}') GROUP BY products."id" ORDER BY products."updatedAt" DESC`
    );
    totalRows = query[0].length;
    const totalPage = Math.ceil(totalRows / limit);
    const product = await db.sequelize.query(
      `SELECT products.*, sum(orderdetails.quantity) AS "stock" FROM orderdetails RIGHT JOIN products ON orderdetails."productId" = products."id" WHERE(products.sku ILIKE '%${search}%' OR products."name" ILIKE '%${search}%' OR products."status" = '${status}') GROUP BY products."id" ORDER BY "updatedAt" DESC`,
      // `SELECT products.*, sum(orderdetails.quantity) AS "stock" FROM orderdetails RIGHT JOIN products ON orderdetails."productId" = products."id" GROUP BY products."id" ORDER BY "updatedAt"`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    res.json({
      product,
      page,
      limit,
      totalRows,
      totalPage,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAvailableStock = async (req, res) => {
  try {
    const query = await db.sequelize.query(
      `SELECT products.*, sum(orderdetails.quantity) FROM products INNER JOIN orderdetails ON products."id" = orderdetails."productId" WHERE products.status = 'active' GROUP BY products."id" HAVING sum(orderdetails.quantity) > 0`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    res.send(query);
  } catch (error) {
    console.log(error);
  }
};

const getProductBySupplier = async (req, res) => {
  try {
    const query = await db.sequelize.query(
      `SELECT products.* FROM products INNER JOIN suppliers ON products."supplierId" = suppliers."id" WHERE suppliers."id" = (:id) AND products."status" = 'active'`,
      {
        replacements: { id: req.params.id },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    res.send(query);
  } catch (error) {
    console.log(error);
  }
};

const checkProductOrder = async (req, res) => {
  try {
    const query = await db.sequelize.query(
      `SELECT products."id" FROM orderdetails INNER JOIN products ON orderdetails."productId" = products."id" GROUP BY products."id"`,
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
  checkProductOrder,
  getProductBySupplier,
};
