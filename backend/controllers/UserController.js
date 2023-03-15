// Import model Users

const user = require("../models/user");

// import Users from "../models/Users.js";
const Users = require("../models").user;
const Order = require("../models").order;
const bcrypt = require("bcrypt");

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

  if (req.body.username) {
    // mengecek username sudah ada di db
    const username = await Users.findOne({
      where: { username: req.body.username.toLowerCase() },
    });

    // kalau ada username orang lain sama(username)
    // tapi lolos jika usernmae = usernmae dia
    if (username) {
      return res.status(409).json({
        status: "error",
        message: "username sudah terdaftar",
      });
    }
  }
  // hashing password
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  try {
    const cek = await Users.update(
      {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        mobile: req.body.mobile,
        role: req.body.role,
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

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
