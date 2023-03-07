import { Route, Routes } from "react-router-dom";
import Sidebar from "./sidebar";
import Home from "./page/home";

import Product from "./page/product";
import AddProduct from "./page/product/add";
import DetailProduct from "./page/product/detail";
import EditProduct from "./page/product/edit";

import Category from "./page/category";
import AddCategory from "./page/category/add";
import EditCategory from "./page/category/edit";

import Blank from "./page/blank";

const Main = () => {
  return (
    <main>
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* Product Page */}
          <Route path="/products" element={<Product />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/:id" element={<DetailProduct />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />

          {/* category page */}
          <Route path="/category" element={<Category />} />
          <Route path="/category/add" element={<AddCategory />} />
          <Route path="/category/edit/:id" element={<EditCategory />} />

          <Route path="/transaction" element={<Product />} />
          <Route path="/customer" element={<Product />} />
          <Route path="/supplier" element={<Product />} />
          <Route path="/not-found" element={<Blank />} />
        </Routes>
      </div>
    </main>
  );
};

export default Main;
