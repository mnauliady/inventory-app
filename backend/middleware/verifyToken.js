const jwt = require("jsonwebtoken");
const Users = require("../models").user;

// mengecek token
const verifyToken = (req, res, next) => {
  // data header
  const authHeader = req.headers["authorization"];

  // data token
  const token = authHeader && authHeader.split(" ")[1];

  // jika token null maka akan mengirim status unauthorize
  if (token == null) return res.sendStatus(401);

  // verifikasi token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    // jika error
    if (err) return res.sendStatus(403);

    // jika berhasil akan decoded email
    req.email = decoded.email;
    next();
  });
};

// hak akses untuk role admin dan super admin
const adminRole = async (req, res, next) => {
  // cek role user menggunakan cookies
  const user = await Users.findOne({
    where: {
      refresh_token: req.cookies.refreshToken,
    },
  });

  // jika user tidak ditemukan
  if (!user) return res.status(404).json({ msg: "User not found" });

  // jika user adalah admin atau super admin
  if (user.role === "admin" || user.role === "super") {
    next();
  } else {
    // jika user buka admin atau super admin
    return res.status(403).json({ msg: "Access Denied" });
  }
};

// hak akses untuk role super admin
const superAdminRole = async (req, res, next) => {
  // cek role user menggunakan cookies
  const user = await Users.findOne({
    where: {
      refresh_token: req.cookies.refreshToken,
    },
  });
  // jika user tidak ditemukan
  if (!user) return res.status(404).json({ msg: "User not found" });

  // jika user bukan super admin
  if (user.role !== "super") return res.status(403).json({ msg: "Access Denied" });

  // jika user super admin
  next();
};

module.exports = { verifyToken, adminRole, superAdminRole };
