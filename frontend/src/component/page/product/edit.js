import React from "react";

//import hook useState from react
import { useState, useEffect } from "react";

//import axios
import axios from "axios";

//import hook history dari react router dom
import { useNavigate, Link, useParams } from "react-router-dom";

const EditProduct = () => {
  // Get Data untuk dropdown
  //define state
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedSupplier, setSelectedSupplier] = useState();

  //state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [min_stock, setMin_Stock] = useState("");
  const [sku, setSku] = useState("");
  const [status, setStatus] = useState("");
  const [url_photo, setUrl_photo] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  //useEffect hook
  useEffect(() => {
    //panggil method "dataCategory"
    dataCategory();
    //panggil method "dataSupplier"
    dataSupplier();
    //panggil function "getProductById"
    getProductById();
  }, []);

  //get ID from parameter URL
  const { id } = useParams();

  //function "getProductById"
  const getProductById = async () => {
    try {
      //get data from server
      const response = await axios.get(`http://localhost:5000/products/${id}`);
      //get response data
      const data = await response.data;
      //assign data to state
      setSku(data.sku);
      setPrice(data.price);
      setName(data.name);
      setStatus(data.status);
      setCategoryId(data.categoryId);
      setSelectedCategory(data.categoryId);
      setMin_Stock(data.min_stock);
      setUrl_photo(data.url_photo);
      setSupplierId(data.supplierId);
      setSelectedSupplier(data.supplierId);
    } catch (error) {
      navigate("/not-found");
    }
  };

  const dataCategory = async () => {
    // cek product memiliki transaksi atau order
    const res = await axios.get(`http://localhost:5000/products/order`);

    for (let i = 0; i < res.data.length; i++) {
      // jika ada
      if (id == res.data[i].id) {
        document.getElementById("category").classList.add("hidden");
      }
    }

    //get data from server
    const response = await axios.get(`http://localhost:5000/categories`);
    //get response data
    const data = await response.data.category;
    //assign response data to state "products"
    setCategories(data);
  };

  const dataSupplier = async () => {
    //get data from server
    const response = await axios.get(`http://localhost:5000/suppliers`);
    //get response data
    const data = await response.data.supplier;
    //assign response data to state "suppliers"
    setSuppliers(data);
  };
  // ===================================================

  // Load file =========================================
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");

  const loadImage = (e) => {
    const image = e.target.files[0];

    if (image.type == "image/jpeg" || image.type == "image/png" || image.type == "image/jpg") {
      console.log("gambar");
    } else {
      window.alert("Please upload a image file (png/jpg/jpeg)");
      return false;
    }

    // cek size image
    if (image.size > 3000000) {
      window.alert("Please upload a file smaller than 3 MB");
      return false;
    }
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };
  // ===================================================

  //state validation
  const [validation, setValidation] = useState({});
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleSelectCategory = (e) => {
    setSelectedCategory(e.target.value);

    setSku(e.target.selectedOptions[0].getAttribute("data-set"));
  };

  const handleSelectSupplier = (e) => {
    setSelectedSupplier(e.target.value);
  };

  const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");

  const handleChange = (event) => setPrice(addCommas(removeNonNumeric(event.target.value)));

  //method "updateProduct"
  const updateProduct = async (e) => {
    e.preventDefault();

    console.log(sku);
    //send data to server
    await axios
      .put(
        `http://localhost:5000/products/${id}`,
        {
          sku,
          name,
          price,
          status,
          min_stock,
          categoryId: selectedCategory,
          supplierId: selectedSupplier,
          url_photo: file,
        },
        {
          headers: {
            "Content-type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        //redirect
        setShowModal(true);
        // navigate("/products");
      })
      .catch((error) => {
        //assign validation on state
        setValidation(error.response.data);
      });
  };

  const cancel = () => {
    setFile();
    setPreview();
  };

  return (
    <section className="w-full bg-gray-100 md:h-[calc(100vh-48px)]">
      <div id="main" className="main-content flex-1 bg-gray-100 pb-24 md:pb-5">
        <div className="bg-gray-800">
          <div className=" bg-blue-800 p-4 shadow text-2xl text-white">
            <h1 className="font-bold pl-2">Product</h1>
          </div>
        </div>

        {/* Modal Success Edit*/}
        {showModal && (
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur-sm bg-white/30">
            <div className="relative w-2/5 my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-300 drop-shadow-2xl  outline-none focus:outline-none">
                <div className="mx-auto text-green-700 p-5 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-32"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-base mx-auto">Data Successfully Updated</h3>
                <div className="text-center p-6  rounded-b">
                  <button
                    className="text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-base px-4 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-44"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      navigate("/products");
                    }}
                  >
                    Back to list product
                  </button>
                  {/* <button
                    onClick={() => {
                      setShowModal(false);
                    }}
                    className="text-white bg-green-600 hover:bg-green-700 active:bg-green-700 text-base px-4 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-40"
                  >
                    Continue to edit
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* form */}
        <div className="flex flex-wrap mx-8 mt-8">
          <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg bg-white border border-gray-200 p-4">
            <form className="space-y-6" onSubmit={updateProduct}>
              <h5 className="text-xl font-medium text-gray-900 dark:text-white">Edit Product</h5>
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
                {/* product name */}
                <div className="md:w-2/3 md:mr-2 w-full">
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

                {/* Status */}
                <div className="md:w-1/3 w-full">
                  <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    onChange={(e) => setStatus(e.target.value)}
                    value={status}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="">Select status</option>
                    <option value="active">Active</option>
                    <option value="not active">Not Active</option>
                  </select>
                </div>
              </div>

              <div className="w-full md:flex">
                <div className="w-full md:w-1/6 md:mr-2">
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
                    className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>

                {/* price */}
                <div className="w-full md:w-1/6 md:mr-2">
                  <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Price
                  </label>
                  <input
                    value={price.toLocaleString()}
                    onChange={handleChange}
                    type="text"
                    name="price"
                    id="price"
                    autoComplete="off"
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>

                {/* supplier */}
                <div className="w-full md:w-2/6 md:mr-2">
                  <label htmlFor="supplier" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Select supplier
                  </label>
                  <select
                    id="supplier"
                    name="supplierId"
                    value={selectedSupplier}
                    onChange={handleSelectSupplier}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option defaultValue>Choose a supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* category */}
                <div id="category" className="w-full md:w-2/6">
                  <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Select Category
                  </label>
                  <select
                    name="categoryId"
                    value={selectedCategory}
                    onChange={handleSelectCategory}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option>Choose a category</option>
                    {categories.map((category) => (
                      <option key={category.id} data-set={category.code} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* minimal storck */}

              <div className="md:flex w-full">
                {/* Picture/photo */}
                <div className="w-full md:w-1/3 md:mr-2">
                  <p className=" text-sm font-medium text-gray-900 dark:text-white">Upload Photo</p>
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
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
                    <input id="dropzone-file" type="file" className="hidden" onChange={loadImage} />
                  </label>
                </div>

                <div className="w-full md:w-1/3 md:mr-2">
                  <div className="w-full">
                    <figure>
                      <p className=" text-sm font-medium text-gray-900 dark:text-white">Old Photo</p>
                      <img
                        src={url_photo ? `http://localhost:5000/images/${url_photo}` : ``}
                        alt={name}
                        className="text-gray-200 rounded-md h-64 w-full object-cover"
                      />
                    </figure>
                  </div>
                </div>

                {/* preview gambar yg diupload */}
                <div className="w-full md:w-1/3">
                  {preview ? (
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">New Photo</p>
                      <figure className="w-full relative">
                        <button
                          className="absolute top-2 right-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                          onClick={() => {
                            cancel();
                          }}
                        >
                          <span className="  ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </span>
                        </button>
                        <img
                          src={preview}
                          alt="Preview Image"
                          className=" text-gray-200 rounded-md h-64 w-full object-cover"
                        />
                      </figure>
                    </div>
                  ) : (
                    ""
                  )}
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

export default EditProduct;
