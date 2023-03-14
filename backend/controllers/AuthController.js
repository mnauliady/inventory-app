const Users = require("../models").user;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { check, validationResult } = require("express-validator");

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
  await check("name").isLength({ min: 3 }).withMessage("Minimal 3 character").run(req);
  await check("email").isEmail().withMessage("Wrong email format").run(req);
  await check("mobile").notEmpty().isLength({ min: 9, max: 15 }).withMessage("length must between 9-15").run(req);
  await check("role")
    .isIn(["super admin", "admin", "manager"])
    .withMessage("Only accept super/admin/manager role")
    .run(req);

  // mengecek email sudah ada di db
  const email = await Users.findOne({
    where: { email: req.body.email.toLowerCase() },
  });

  if (email) {
    const result = { msg: "Email already registered", param: "email" };
    return res.status(409).json({
      errors: [result],
    });
  }

  // mengecek password dan confirm password sama
  // if (req.body.password !== req.body.confPassword) {
  //   const result = { msg: "Password and Confirm Password not match", param: "password" };
  //   return res.status(409).json({
  //     errors: [result],
  //   });
  // }

  // tampilkan jika ada error
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const password = "123456";
  // hashing password
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
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

    console.log(user);
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
    console.log(error);
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

const Me = async (req, res) => {
  if (!req.cookies.refreshToken) {
    return res.status(401).json({ msg: "Please login!" });
  }
  const user = await Users.findOne({
    attributes: ["id", "name", "email", "role"],
    where: {
      refresh_token: req.cookies.refreshToken,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });
  console.log(user);
  res.status(200).json(user);
};

const resetPass = async (req, res) => {
  if (req.body.email) {
    // mengecek email sudah ada di db
    const email = await Users.findOne({
      where: { email: req.body.email.toLowerCase() },
    });

    if (email) {
      return res.status(409).json({
        status: "error",
        message: "email sudah terdaftar",
      });
    }
  }

  // hashing password
  const password = "123456";
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    const cek = await Users.update(
      {
        password: hashPassword,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    if (cek == 1) {
      res.json({
        message: "Data berhasil diupdate",
      });
    } else {
      // jika id user tidak ditemukan
      res.status(409).json({
        status: "error",
        message: "id user tidak ada",
      });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports = { getUser, Register, Login, Logout, Me, resetPass };
