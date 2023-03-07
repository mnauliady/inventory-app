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
      setCategory(data.category.name);
      setSupplier(data.supplier.name);
    } catch (error) {
      navigate("/not-found");
    }
  };

  return (
    <section className="w-full">
      <div id="main" className="main-content h-full flex-1 bg-gray-100 mt-12 md:mt-2 pb-24 md:pb-5">
        <div className="bg-gray-800 pt-3">
          <div className=" bg-blue-800 p-4 shadow text-2xl text-white">
            <h1 className="font-bold pl-2">Product</h1>
          </div>
        </div>

        <div className="flex flex-wrap mt-8 mx-8 mb-10">
          <div role="status" className="w-full space-y-8 md:space-y-0 md:space-x-8 md:flex">
            <div className="flex  justify-center w-full rounded md:w-2/5">
              <img
                src={
                  url_photo
                    ? `http://localhost:5000/images/${url_photo}`
                    : `https://source.unsplash.com/600x400?computer`
                }
                alt={name}
                className=" text-gray-200 rounded-md"
              />
            </div>
            <div className="w-3/5">
              <ul className=" text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="font-bold">Status :</span> {status}
                </li>
                <li className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  <span className="font-bold">SKU : </span> {sku}
                </li>
                <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="font-bold">Name : </span> {name}
                </li>
                <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="font-bold">Stock :</span> {stock}
                </li>
                <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="font-bold">Minimal Stock :</span> {min_stock}
                </li>
                <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="font-bold">Price :</span> Rp {price.toLocaleString()}
                </li>
                <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="font-bold">Category :</span> {category}
                </li>
                <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600 rounded-b-lg">
                  <span className="font-bold">Supplier :</span> {supplier}
                </li>
              </ul>
              <div className="mt-4">
                <Link
                  to="/products"
                  className=" text-white bg-gray-500 hover:bg-gray-600 rounded-md font-medium text-sm px-5 py-2.5 mr-2 mb-2"
                >
                  Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailProduct;
