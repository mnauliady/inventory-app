import React from "react";

//import hook useState from react
import { useState, useEffect } from "react";

//import axios
import axios from "axios";

//import hook history dari react router dom
import { useNavigate, Link } from "react-router-dom";

const AddProduct = () => {
  // Get Data untuk dropdown
  //define state
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // state category dan supplier yg di select/pilih pada form
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedSupplier, setSelectedSupplier] = useState();

  //useEffect hook
  useEffect(() => {
    //panggil method "dataCategory"
    dataCategory();
    //panggil method "dataSupplier"
    dataSupplier();
  }, []);

  // fungsi untuk menampilkan seluruh data cataegory untuk dropdown pada form
  const dataCategory = async () => {
    //get data from server
    const response = await axios.get(`http://localhost:5000/categories`);
    //get response data
    const data = await response.data;
    //assign response data to state "products"
    setCategories(data);
  };

  // fungsi untuk menampilkan seluruh data supplier untuk dropdown pada form
  const dataSupplier = async () => {
    //get data from server
    const response = await axios.get(`http://localhost:5000/suppliers`);
    //get response data
    const data = await response.data;
    //assign response data to state "suppliers"
    setSuppliers(data);
  };
  // ===================================================

  // Load file gambar dan preview ======================
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");

  const loadImage = (e) => {
    const image = e.target.files[0];

    // cek size image
    if (image.size > 3000000) {
      window.alert("Please upload a file smaller than 3 MB");
      return false;
    }
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };
  // ===================================================

  // Proses Add data ===================================
  //state
  const [name, setName] = useState("");
  const [min_stock, setMin_Stock] = useState("");
  const [price, setPrice] = useState("");
  const [sku, setSku] = useState("");

  // state validation
  const [validation, setValidation] = useState({});

  const navigate = useNavigate();

  // fungsi untuk handle form select category
  const handleSelectCategory = (e) => {
    setSelectedCategory(e.target.value);
    // set nilai sku/code product berdasarkan nama category
    setSku(e.target.selectedOptions[0].getAttribute("data-set"));
  };

  // fungsi untuk handle form select supplier
  const handleSelectSupplier = (e) => {
    setSelectedSupplier(e.target.value);
  };

  //method "storePost"
  const storePost = async (e) => {
    e.preventDefault();

    //send data to server
    await axios
      .post(
        "http://localhost:5000/products",
        {
          sku,
          name,
          price,
          min_stock,
          categoryId: selectedCategory,
          supplierId: selectedSupplier,
          url_photo: file,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        //redirect ke halaman product
        navigate("/products");
      })
      .catch((error) => {
        //assign validation on state
        setValidation(error.response.data);
      });
  };

  return (
    <section className="w-full bg-gray-100 md:h-[calc(100vh-48px)]">
      <div id="main" className="main-content flex-1 bg-gray-100 pb-24 md:pb-5">
        <div className="bg-gray-800 pt-3">
          <div className=" bg-blue-800 p-4 shadow text-2xl text-white">
            <h1 className="font-bold pl-2">Product</h1>
          </div>
        </div>

        {/* form */}
        <div className="flex flex-wrap mx-8 mt-8">
          <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg bg-white border border-gray-200 p-4">
            <form className="space-y-6" onSubmit={storePost}>
              <h5 className="text-xl font-medium text-gray-900 dark:text-white">Add New Product</h5>
              <hr />

              {/* error handling */}
              {validation.errors && (
                <div className="bg-red-500 rounded-md w-1/2">
                  <ul className="py-2 px-4 text-white">
                    {validation.errors.map((error, index) => (
                      <li key={index}>
                        <span className="font-semibold">{error.msg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="w-full md:flex">
                {/* Product Name */}
                <div className="md:w-4/6 md:mr-2 w-full">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Product Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>

                {/* Minimal Stock */}
                <div className="md:w-1/6 w-full md:mr-2">
                  <label htmlFor="min_stock" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Minimal Stock
                  </label>
                  <input
                    value={min_stock}
                    onChange={(e) => setMin_Stock(e.target.value)}
                    type="number"
                    name="min_stock"
                    id="min_stock"
                    min="1"
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>

                {/* price */}
                <div className="md:w-1/6 w-full">
                  <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Price (IDR)
                  </label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                    name="price"
                    id="price"
                    min="0"
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="w-full md:flex">
                {/* Category */}
                <div className="md:w-2/6 w-full md:mr-2">
                  <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Select the category
                  </label>
                  <select
                    id="category"
                    name="categoryId"
                    onChange={handleSelectCategory}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="">Select the category</option>
                    {categories.map((category) => (
                      <option key={category.id} data-set={category.code} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Supplier */}
                <div className="md:w-2/6 w-full md:mr-2">
                  <label htmlFor="supplier" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Select the Supplier
                  </label>
                  <select
                    id="supplier"
                    name="supplierId"
                    onChange={handleSelectSupplier}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="">Select the supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* IMage upload */}
              <div className="md:flex w-full">
                <div className="w-full md:w-1/3 md:mr-2">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    Upload Picture
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        aria-hidden="true"
                        className="w-10 h-10 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">JPEG, PNG, or JPG (MAX. 3 MB)</p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={loadImage}
                      accept=".png,.jpg,.jpeg"
                      required
                    />
                  </label>
                </div>

                <div className="w-full md:w-1/3 md:mr-2">
                  <div className="w-full">
                    {/* preview gambar yg diupload */}
                    {preview ? (
                      <figure className="w-full">
                        <img
                          src={preview}
                          className=" text-gray-200 rounded-md h-64 w-full object-cover"
                          alt="Preview Image"
                        />
                      </figure>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>

              <Link
                to="/products"
                className=" text-white bg-gray-500 hover:bg-gray-600 rounded-md font-medium text-sm px-5 py-2.5 mr-2 mb-2"
              >
                Back
              </Link>
              <button
                type="submit"
                className="w-24 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddProduct;
