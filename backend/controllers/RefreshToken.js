// import Users from "../models/UserModel.js";
const Users = require("../models").user;
// import jwt from "jsonwebtoken";
const jwt = require("jsonwebtoken");

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(req.cookies.refreshToken);
    if (!refreshToken) return res.sendStatus(401);
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      const payload = {
        userId: user[0].id,
        name: user[0].name,
        // email: user[0].email,
        role: user[0].role,
      };
      const userId = user[0].id;
      const name = user[0].name;
      const email = user[0].email;
      const role = user[0].role;
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1m",
      });
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = refreshToken;
