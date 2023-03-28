import { Route, Routes } from "react-router-dom";
import Sidebar from "./sidebar";
import Home from "./page/home";

import Product from "./page/product";
import AddProduct from "./page/product/add";
import DetailProduct from "./page/product/detail";
import EditProduct from "./page/product/edit";

import Category from "./page/category";
import AddCategory from "./page/category/add";
import DetailCategory from "./page/category/detail";
import EditCategory from "./page/category/edit";

import Blank from "./page/blank";

import Customer from "./page/customer";
import AddCustomer from "./page/customer/add";
import DetailCustomer from "./page/customer/detail";
import EditCustomer from "./page/customer/edit";

import Supplier from "./page/supplier";
import AddSupplier from "./page/supplier/add";
import EditSupplier from "./page/supplier/edit";
import DetailSupplier from "./page/supplier/detail";

import Transaction from "./page/transaction";
import AddTransaction from "./page/transaction/add";
import AddTransactionDetail from "./page/transactionDetail/add";
import Final from "./page/transactionDetail/final";
import User from "./page/user";
import AddUser from "./page/user/add";
import Forbidden from "./page/forbidden";
import Profile from "./page/profile";
import EditProfile from "./page/profile/edit";
import ChangePassword from "./page/profile/changePassword";
import DetailTransaction from "./page/transaction/detail";
import Log from "./page/log";

const Main = () => {
  return (
    <main className="overflow-y-auto">
      <div className="flex flex-col md:flex-row ">
        <Sidebar />

        <Routes>
          <Route exact path="/" element={<Home />} />
          {/* <Route path="/home" element={<Home />} /> */}

          {/* Product Page */}
          <Route path="/products" element={<Product />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/:id" element={<DetailProduct />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />

          {/* category page */}
          <Route path="/category" element={<Category />} />
          {/* <Route path="/category/add" element={<AddCategory />} /> */}
          <Route path="/category/:id" element={<DetailCategory />} />
          {/* <Route path="/category/edit/:id" element={<EditCategory />} /> */}

          <Route path="/transaction" element={<Transaction />} />
          <Route path="/transaction/add" element={<AddTransaction />} />
          <Route path="/transaction/:id" element={<DetailTransaction />} />
          <Route path="/transaction/final/:id" element={<Final />} />

          <Route path="/transaction/add/detail/:id" element={<AddTransactionDetail />} />

          {/* customer page */}
          <Route path="/customer" element={<Customer />} />
          {/* <Route path="/customer/add" element={<AddCustomer />} /> */}
          {/* <Route path="/customer/edit/:id" element={<EditCustomer />} /> */}
          <Route path="/customer/:id" element={<DetailCustomer />} />

          {/* Supplier page */}
          <Route path="/supplier" element={<Supplier />} />
          {/* <Route path="/supplier/add" element={<AddSupplier />} /> */}
          {/* <Route path="/supplier/edit/:id" element={<EditSupplier />} /> */}
          <Route path="/supplier/:id" element={<DetailSupplier />} />

          <Route path="/user" element={<User />} />
          {/* <Route path="/user/add" element={<AddUser />} /> */}

          {/* <Route path="/profile/edit/:id" element={<EditProfile />} /> */}
          {/* <Route path="/profile/change/password/:id" element={<ChangePassword />} /> */}
          <Route path="/profile/:id" element={<Profile />} />

          <Route path="/log" element={<Log />} />
          <Route path="/not-found" element={<Blank />} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="/*" element={<Blank />} />
        </Routes>
      </div>
    </main>
  );
};

export default Main;
