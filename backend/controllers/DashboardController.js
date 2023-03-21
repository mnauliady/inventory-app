const Customer = require("../models").customer;
const Product = require("../models").product;
const db = require("../models/index");

// Get semua category
const getDashboard = async (req, res) => {
  try {
    const dataOut = await db.sequelize.query(
      `SELECT sum(orderdetails.quantity * orderdetails."productPrice") AS total, orders."type" FROM orderdetails INNER JOIN orders ON orderdetails."orderId" = orders."id" WHERE orders."type" = 'OUT' GROUP BY orders."type"`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const dataIn = await db.sequelize.query(
      `SELECT sum(orderdetails.quantity * orderdetails."productPrice") AS total, orders."type" FROM orderdetails INNER JOIN orders ON orderdetails."orderId" = orders."id" WHERE orders."type" = 'IN' GROUP BY orders."type"`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const totalProduct = await db.sequelize.query(`SELECT sum(orderdetails.quantity) AS "total" FROM orderdetails`, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.json({ dataOut, dataIn, totalProduct });
  } catch (err) {
    console.log(err);
  }
};

const getLineChart = async (req, res) => {
  try {
    const dataOut = await db.sequelize.query(
      `SELECT count(*) AS total, orders."date" FROM orders WHERE orders."type" = 'OUT' GROUP BY orders."date"`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const dataIn = await db.sequelize.query(
      `SELECT count(*) AS total, orders."date" FROM orders WHERE orders."type" = 'IN' GROUP BY orders."date"`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    return res.json({ dataOut, dataIn });
  } catch (err) {
    console.log(err);
  }
};

const getBarChart = async (req, res) => {
  try {
    const dataTotal = await db.sequelize.query(
      `SELECT categories."name", count(categories."id") AS total FROM products INNER JOIN categories ON products."categoryId" = categories."id" GROUP BY categories."id"`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    return res.json({ dataTotal });
  } catch (err) {
    console.log(err);
  }
};

const getBarChart2 = async (req, res) => {
  try {
    const dataIn = await db.sequelize.query(
      `SELECT sum(orderdetails.quantity) AS total, products."name" FROM orderdetails INNER JOIN products ON orderdetails."productId" = products."id" INNER JOIN orders ON orderdetails."orderId" = orders."id" WHERE orders."type" = 'IN' GROUP BY products."id"`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const dataOut = await db.sequelize.query(
      `SELECT sum(orderdetails.quantity) AS total, products."name" FROM orderdetails INNER JOIN products ON orderdetails."productId" = products."id" INNER JOIN orders ON orderdetails."orderId" = orders."id" WHERE orders."type" = 'OUT' GROUP BY products."id"`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const product = await Product.findAll();

    return res.json({ dataIn, dataOut, product });
  } catch (err) {
    console.log(err);
  }
};
module.exports = { getDashboard, getLineChart, getBarChart, getBarChart2 };
