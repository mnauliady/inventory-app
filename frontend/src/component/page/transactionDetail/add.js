import React from "react";

//import hook useState from react
import { useState, useEffect, useRef } from "react";

//import axios
import axios from "axios";

//import hook history dari react router dom
import { useNavigate, Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const AddTransactionDetail = () => {
  // Proses Add data ===================================
  //state
  const [quantity, setQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [type, setType] = useState("");

  const [product, setProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();

  // state validation
  const [validation, setValidation] = useState({});

  const navigate = useNavigate();

  //function "fetchData"
  const fectData = async () => {
    //fetching
    const response = await axios.get(`http://localhost:5000/orders/${id}`);
    //get response data
    const data = await response.data;

    setType(data.type);
    //assign response data to state "orderdetail"
    setOrderdetail(data.orderdetail);
  };

  // fungsi untuk menampilkan seluruh data supplier untuk dropdown pada form
  const dataProduct = async () => {
    //get data from server
    const response = await axios.get(`http://localhost:5000/products/available`);

    //get response data
    const data = await response.data;

    //assign response data to state "product"
    setProduct(data);
  };

  //useEffect hook
  useEffect(() => {
    //panggil method "fetchData"
    fectData();
    //panggil method "dataProduct"
    dataProduct();
  }, []);

  const [orderdetail, setOrderdetail] = useState([]);

  // fungsi untuk handle form select product
  const handleSelectProduct = async (e) => {
    if (type == "OUT") {
      const response = await axios.get(`http://localhost:5000/stock/${e.target.value}`);
      setMaxQuantity(response.data[0].sum);
    }

    setSelectedProduct(e.target.value);
    setName(e.target.selectedOptions[0].getAttribute("data-name"));
    setPrice(e.target.selectedOptions[0].getAttribute("data-price"));
  };

  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();

  // add data
  const storeData = async (e) => {
    e.preventDefault();

    //send data to server
    await axios
      .post("http://localhost:5000/orderdetails", {
        orderId: id,
        productId: selectedProduct,
        productName: name,
        quantity,
        productPrice: price,
      })
      .then(async () => {
        //redirect ke halaman transaction
        //get ID from parameter URL
        fectData();
      })
      .catch((error) => {
        //assign validation on state
        setValidation(error.response.data);
      });

    document.getElementById("add-form").reset();
    // e.target.reset();
  };

  const deleteTransaction = async (id) => {
    //sending
    await axios.delete(`http://localhost:5000/orderdetails/${id}`);

    //panggil function "fetchData"
    fectData();
  };

  return (
    <section className="w-full">
      <div id="main" className="main-content flex-1 bg-gray-100 mt-12 md:mt-2 pb-24 md:pb-5 h-full">
        <div className="bg-gray-800 pt-3">
          <div className=" bg-blue-800 p-4 shadow text-2xl text-white">
            <h1 className="font-bold pl-2">Detail Transaction</h1>
          </div>
        </div>

        <div className="flex flex-wrap mx-8 mt-8">
          <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg bg-white border border-gray-200 p-4">
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">Add Detail Transaction</h5>
            <hr />

            {/* form */}
            <form className="space-y-6 " onSubmit={storeData} id="add-form">
              {/* error handling */}
              {validation.errors && (
                <div className="bg-red-500 rounded-md w-1/2">
                  <ul className="py-2 px-4 text-white">
                    {validation.errors.map((error, index) => (
                      <li key={index}>
                        <span className="font-semibold">{error.param}</span> : {error.msg}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className=" text-sm text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Product Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderdetail.map((detail, index) => (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      key={detail.id}
                    >
                      <td scope="row" className="px-6 py-4 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">{detail.productName}</td>
                      <td className="px-6 py-4">{Math.abs(detail.quantity)}</td>
                      <td className="px-6 py-4">
                        <Link
                          onClick={() => {
                            if (window.confirm("Delete the item?")) {
                              deleteTransaction(detail.id);
                            }
                          }}
                          className=" text-white bg-red-500 hover:bg-red-600 rounded-md text-sm px-2 py-1.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-res-700"
                        >
                          Delete
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex">
                <select
                  id="product"
                  name="productId"
                  onChange={handleSelectProduct}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-3"
                >
                  <option value="">Select the product</option>
                  {product.map((product) => (
                    <option key={product.id} data-name={product.name} data-price={product.price} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>

                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Quantity"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/4 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mr-3"
                />

                <button
                  type="submit"
                  className="w-24 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 "
                >
                  Add
                </button>
              </div>
            </form>
            <Link
              className="w-24 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt"
              to={`/transaction/final/${id}`}
            >
              Next
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddTransactionDetail;
