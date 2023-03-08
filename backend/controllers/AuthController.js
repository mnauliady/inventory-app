const Users = require("../models").user;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

// hapus ===============================
const getUser = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email"],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

// fungsi untuk register user baru
const Register = async (req, res) => {
  // mengecek email sudah ada di db
  const email = await Users.findOne({
    where: { email: req.body.email.toLowerCase() },
  });

  if (email) {
    return res.status(409).json({
      status: "error",
      message: "username already registered",
    });
  }

  // mengecek username sudah ada di db
  const username = await Users.findOne({
    where: { username: req.body.username.toLowerCase() },
  });

  if (username) {
    return res.status(409).json({
      status: "error",
      message: "username already registered",
    });
  }

  // mengecek password dan confirm password sama
  if (req.body.password !== req.body.confPassword) {
    return res.status(409).json({ status: "error", message: "Password and Confirm Password not match" });
  }

  // hashing password
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  try {
    // create/add ke db
    await Users.create({
      id: uuidv4(),
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      mobile: req.body.mobile,
      role: req.body.role,
      password: hashPassword,
    });
    res.json({ message: "Register successfully" });
  } catch (error) {
    // jika gagal
    console.log(error);
  }
};

// Login berdasarkan email
const Login = async (req, res) => {
  try {
    // mencari email berdasrkan input
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    // mengecek password
    const match = await bcrypt.compare(req.body.password, user[0].password);
    // jika tidak sesuai
    if (!match) return res.status(400).json({ msg: "Failed to login" });
    // set user, name, email untuk jwt
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
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "Failed to login" });
  }
};

// fungsi logout
const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

// ==========================================
const isAdmin = async (req, res, next) => {
  try {
    const user = await Users.findAll({
      where: {
        id: req.params.id,
      },
    });
    if (user[0].role == "admin") {
      res.send(true);
    } else {
      res.status(403).send({
        auth: false,
        message: "Error",
        message: "Require Admin Role",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getUser, Register, Login, Logout, isAdmin };
