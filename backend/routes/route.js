const express = require("express");

// Init express router
const router = express.Router();
// Import Controller Category
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/CategoryController.js");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllStock,
  getStockById,
  getAvailableStock,
} = require("../controllers/ProductController.js");

const { getUsers, getUserById, createUser, updateUser, deleteUser } = require("../controllers/UserController.js");

const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/CustomerController.js");

const {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/SupplierController.js");

const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getLastData,
} = require("../controllers/OrderController.js");

const {
  getOrderDetails,
  getOrderDetailById,
  createOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
} = require("../controllers/OrderDetailController.js");

// middleware untuk mengecek user login dan hak akses berdasarkan role
const { verifyToken, adminRole, superAdminRole } = require("../middleware/verifyToken");

const refreshToken = require("../controllers/RefreshToken");
const { getUser, Register, Login, Logout, Me, resetPass } = require("../controllers/AuthController");

// router.get("/alluser", verifyToken, getUser);
router.get("/alluser", getUser);
router.put("/reset/:id", resetPass);
router.post("/register", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);
router.get("/me", Me);

// Route Category ============================================
router.get("/categories", getCategories);
router.get("/categories/:id", getCategoryById);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);
// ===========================================================

// middleware upload image
const imageUpload = require("../middleware/uploadImage");
// Route Products ============================================
router.get("/products", getProducts);
// router.get("/products/in", getStockIn);
router.get("/products/available", getAvailableStock);
router.get("/products/all", getAllStock);
router.get("/stock/:id", getStockById);
router.get("/products/:id", getProductById);

router.post("/products", imageUpload.single("url_photo"), createProduct, (error, req, res, next) => {
  // send error image input
  return res.status(400).send({ error: error.message });
});

router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
// ===========================================================

// Route Users ===============================================
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
// ===========================================================

// Route Customer ============================================
router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerById);
router.post("/customers", verifyToken, createCustomer);
router.put("/customers/:id", updateCustomer);
router.delete("/customers/:id", deleteCustomer);
// ===========================================================

// Route Supplier ============================================
router.get("/suppliers", getSuppliers);
router.get("/suppliers/:id", getSupplierById);
router.post("/suppliers", createSupplier);
router.put("/suppliers/:id", updateSupplier);
router.delete("/suppliers/:id", deleteSupplier);
// ===========================================================

// Route Order ===============================================
router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);
router.get("/orderlast", getLastData);
router.post("/orders", createOrder);
router.put("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);
// ===========================================================

// Route Order Detail ========================================
router.get("/orderdetails", getOrderDetails);
router.get("/orderdetails/:id", getOrderDetailById);
router.post("/orderdetails", createOrderDetail);
router.put("/orderdetails/:id", updateOrderDetail);
router.delete("/orderdetails/:id", deleteOrderDetail);
// ===========================================================

// export router
module.exports = router;
