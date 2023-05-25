const multer = require("multer");
const path = require("path");
const { check, validationResult } = require("express-validator");

const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: "./public/images",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 3000000, // 3000000 Bytes / 3 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      // upload only png and jpg format
      // const result = { msg: "Please upload a image file (png/jpg/jpeg)" };
      // return res.status(400).json({
      //   errors: [result],
      // });
      return cb(new Error("Please upload a image file (png/jpg/jpeg)"));
    }
    cb(undefined, true);
  },
});

module.exports = imageUpload;
