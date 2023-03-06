const { check, validationResult } = require("express-validator");

const validateCategory = [
  // validasi kategori
  check("name").isLength({ min: 2 }).withMessage("Minimal 2 karakter!"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  },
];

module.exports = validateCategory;
