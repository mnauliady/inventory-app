const express = require("express");
//import library CORS
const cors = require("cors");
//import body parser
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const app = express();
const port = 5000;

//use cors
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(express.static(path.join(__dirname, "public")));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());
// app.use(bodyParser());
app.use(cookieParser());
app.use(express.json());

const Router = require("./routes/route.js");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("home");
});

// use router
app.use(Router);

app.use("/", (req, res) => {
  res.status(404);
  res.send("Page Not foud : 404");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
