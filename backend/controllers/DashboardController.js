const Customer = require("../models").customer;
const Order = require("../models").order;
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

    const transaction = await Order.findAll();

    const lowStock = await db.sequelize.query(
      `SELECT products."id", products."name", min_stock,  sum(COALESCE(orderdetails.quantity,0)) AS "total" FROM orderdetails RIGHT JOIN products ON orderdetails."productId" = products."id" GROUP BY products."id"  
      HAVING sum(COALESCE(orderdetails.quantity,0)) < products.min_stock`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const totalProduct = await db.sequelize.query(`SELECT sum(orderdetails.quantity) AS "total" FROM orderdetails`, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.json({ transaction, lowStock, totalProduct });
  } catch (err) {
    console.log(err);
  }
};

const getLineChart = async (req, res) => {
  try {
    const dataOut = await db.sequelize.query(
      `SELECT to_char(orders."date", 'MM-YYYY') as "month", count(*) AS total FROM orders WHERE orders."type" = 'OUT' GROUP BY 1 ORDER BY 1`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const dataIn = await db.sequelize.query(
      `SELECT to_char(orders."date", 'MM-YYYY') as "month", count(*) AS total FROM orders WHERE orders."type" = 'IN' GROUP BY 1 ORDER BY 1`,
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
      `SELECT categories."name", count(categories."id") AS "total" FROM products INNER JOIN categories ON products."categoryId" = categories."id" GROUP BY categories."id"`,
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
    const data = await db.sequelize.query(
      `SELECT products.*, sum(COALESCE(orderdetails.quantity,0)) AS "total" FROM orderdetails RIGHT JOIN products ON orderdetails."productId" = products."id" GROUP BY products."id" ORDER BY "updatedAt"`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    return res.json({ data });
  } catch (err) {
    console.log(err);
  }
};

const getPieChart = async (req, res) => {
  try {
    const supplier = await db.sequelize.query(`SELECT count("id") FROM suppliers`, {
      type: db.sequelize.QueryTypes.SELECT,
    });
    const customer = await db.sequelize.query(
      `SELECT count("id") FROM customers WHERE customers."type" = 'customer'  `,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    return res.json({ supplier, customer });
  } catch (err) {
    console.log(err);
  }
};

// const getBarChart2 = async (req, res) => {
//   try {
//     const dataIn = await db.sequelize.query(
//       `SELECT sum(orderdetails.quantity) AS total, products."name" FROM orderdetails INNER JOIN products ON orderdetails."productId" = products."id" INNER JOIN orders ON orderdetails."orderId" = orders."id" WHERE orders."type" = 'IN' GROUP BY products."id"`,
//       {
//         type: db.sequelize.QueryTypes.SELECT,
//       }
//     );

//     const dataOut = await db.sequelize.query(
//       `SELECT sum(orderdetails.quantity) AS total, products."name" FROM orderdetails INNER JOIN products ON orderdetails."productId" = products."id" INNER JOIN orders ON orderdetails."orderId" = orders."id" WHERE orders."type" = 'OUT' GROUP BY products."id"`,
//       {
//         type: db.sequelize.QueryTypes.SELECT,
//       }
//     );

//     return res.json({ dataIn, dataOut });
//   } catch (err) {
//     console.log(err);
//   }
// };

module.exports = { getDashboard, getLineChart, getBarChart, getBarChart2, getPieChart };
