const { check, validationResult } = require("express-validator");
const Users = require("../models").user;

const validateUser = [
  // validasi user untuk register
  check("name").isLength({ min: 3 }).withMessage("Minimal 3 karakter!"),
  check("email")
    // To delete leading and triling space
    .trim()
    // Normalizing the email address
    .normalizeEmail()
    .isEmail()
    .withMessage("Format email tidak sesuai"),
  // check()
  check("password").isLength({ min: 6 }).withMessage("Password minimal 6 karakter!"),
  check("role").isIn(["super", "admin", "manager"]).withMessage("Hanya menerima role super/admin/manager"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  },
];

module.exports = validateUser;
