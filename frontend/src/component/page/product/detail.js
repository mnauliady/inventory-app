import React from "react";
//import hook useState dan useEffect from react
import { useState, useEffect } from "react";
//import axios
import axios from "axios";

//import hook history dan params dari react router dom
import { Link, useParams, useNavigate } from "react-router-dom";

const DetailProduct = () => {
  //state
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [min_stock, setMin_Stock] = useState("");
  const [url_photo, setUrl_photo] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");

  //get ID from parameter URL
  const { id } = useParams();

  const navigate = useNavigate();

  //hook useEffect
  useEffect(() => {
    //panggil function "getPOstById"
    getPostById();
  }, []);

  //function "getPostById"
  const getPostById = async () => {
    try {
      //get data from server
      const response = await axios.get(`http://localhost:5000/products/${id}`);
      //get response data
      const data = await response.data;

      //assign data to state
      setSku(data.sku);
      setName(data.name);
      setStock(data.stock);
      setMin_Stock(data.min_stock);
      setUrl_photo(data.url_photo);
      setPrice(data.price);
      setStatus(data.status);
      setCategory(data.category);
      setSupplier(data.supplier);
    } catch (error) {
      navigate("/not-found");
    }
  };

  return (
    <section className="w-full">
      <div id="main" className="main-content h-full flex-1 bg-gray-100 pb-24 md:pb-5">
        <div className="bg-gray-800 pt-3">
          <div className=" bg-blue-800 p-4 shadow text-2xl text-white">
            <h1 className="font-bold pl-2">Product</h1>
          </div>
        </div>

        <div className="flex flex-wrap mt-8 mx-8 mb-10">
          <div className="overflow-hidden bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Product Information</h3>
            </div>
            <div className="md:flex border-t border-gray-200">
              <div className="justify-center w-full md:rounded md:w-2/5 md:m-3 ">
                <img
                  src={
                    url_photo
                      ? `http://localhost:5000/images/${url_photo}`
                      : `https://source.unsplash.com/600x400?computer`
                  }
                  alt={name}
                  className=" text-gray-200 md:rounded-md"
                />
              </div>
              <div className="w-full mr-3 md:w-3/5 my-3">
                <dl>
                  <div className="border-b-2 border-gray-100 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100">
                    <dt className="text-sm font-medium text-gray-500">SKU</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{sku}</dd>
                  </div>
                  <div className="border-b-2 border-gray-100 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Product Name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{name}</dd>
                  </div>
                  <div className="border-b-2 border-gray-100 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 capitalize">{status}</dd>
                  </div>
                  <div className="border-b-2 border-gray-100 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Stock</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{stock}</dd>
                  </div>
                  <div className="border-b-2 border-gray-100 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Minimal Stock</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{min_stock}</dd>
                  </div>
                  <div className="border-b-2 border-gray-100 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Price</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Rp {price.toLocaleString()}</dd>
                  </div>
                  <div className="border-b-2 border-gray-100 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{category}</dd>
                  </div>
                  <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Supplier</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{supplier}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
          <Link
            to="/products"
            className=" text-white bg-gray-500 hover:bg-gray-600 rounded-md font-medium text-sm px-5 py-2.5 mr-2 my-3"
          >
            Back
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DetailProduct;
