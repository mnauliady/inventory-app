// Import model Users

const user = require("../models/user");

// import Users from "../models/Users.js";
const Users = require("../models").user;
const Order = require("../models").order;
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const { check, validationResult } = require("express-validator");

// Get semua user
const getUsers = async (req, res) => {
  try {
    const user = await Users.findAll({
      include: [{ model: Order, as: "order" }],
    });
    res.send(user);
  } catch (err) {
    console.log(err);
  }
};

// Get user berdasarkan id
const getUserById = async (req, res) => {
  if (!uuid.validate(req.params.id)) {
    return res.status(400).json({ status: "error", message: "User not found" });
  }

  try {
    const user = await Users.findByPk(req.params.id);

    // jika user ditemukan (ada pada db)
    if (user) {
      res.send(user);
    } else {
      // jika tidak ditemukan
      return res.status(409).json({
        status: "error",
        message: "user tidak ditemukan",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// Create user baru ================= hapus diganti auth register
const createUser = async (req, res) => {
  try {
    await Users.create(req.body);
    res.json({
      message: "Users Created",
    });
  } catch (err) {
    console.log(err);
  }
};

// Update user berdasarkan id
const updateUser = async (req, res) => {
  await check("name").isLength({ min: 3 }).withMessage("Minimal 3 character").run(req);
  await check("mobile").notEmpty().isLength({ min: 9, max: 15 }).withMessage("length must between 9-15").run(req);

  // tampilkan jika ada error
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  try {
    const cek = await Users.update(
      {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
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

// Delete user berdasarkan id
const deleteUser = async (req, res) => {
  const user = await Users.findByPk(req.params.id, {
    include: [{ model: Order, as: "order" }],
  });

  // jika user memiliki pernah melakukan transaksi tidak bisa dihapus
  if (user.order.length) {
    res.status(409).json({
      status: "error",
      message: "User terikat dengan tabel transaksi sehingga tidak bisa di hapus",
    });
  }

  // jika user sbelum pernah transaksi
  try {
    const cek = await Users.destroy({
      where: {
        id: req.params.id,
      },
    });
    // jika user id ada
    if (cek) {
      res.json({
        message: "Users Deleted",
      });
    } else {
      // jika user id tidak ditemukan
      res.status(409).json({
        status: "error",
        message: "id user tidak ada",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const changePassword = async (req, res) => {
  try {
    // mencari email berdasrkan input
    const user = await Users.findAll({
      where: {
        id: req.params.id,
      },
    });

    // mengecek password
    const match = await bcrypt.compare(req.body.password, user[0].password);

    // jika tidak sesuai
    if (!match) {
      const result = { msg: "Wrong Password", param: "password" };
      return res.status(400).json({
        errors: [result],
      });
    }

    await check("newPassword").isLength({ min: 6 }).withMessage("Password minimal 6 character").run(req);
    // tampilkan jika ada error
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    if (req.body.newPassword !== req.body.confPassword) {
      const result = { msg: "New password and confirm password not match", param: "New password" };
      return res.status(400).json({
        errors: [result],
      });
    }

    // hashing password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.newPassword, salt);

    const update = await Users.update(
      {
        password: hashPassword,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.json({
      message: "Data berhasil diupdate",
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, changePassword };
