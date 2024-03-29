import React from "react";

//import hook useState from react
import { useState, useEffect, useRef } from "react";

//import axios
import axios from "axios";

//import hook history dari react router dom
import { useNavigate, Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";

const AddTransactionDetail = () => {
  // Proses Add data ===================================
  //state
  const [quantity, setQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [type, setType] = useState("");

  const [product, setProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // state validation
  const [validation, setValidation] = useState({});

  const [orderdetail, setOrderdetail] = useState([]);

  const navigate = useNavigate();

  //function "getOrder"
  const getOrder = async () => {
    //fetching
    const response = await axios.get(`http://localhost:5000/orders/${id}`);
    //get response data
    const data = await response.data;

    // set tipe transaksi
    setType(data.type);

    //assign response data to state "orderdetail"
    setOrderdetail(data.orderdetail);

    let response2;
    if (data.type === "OUT") {
      response2 = await axios.get(`http://localhost:5000/products/available`);
    } else {
      response2 = await axios.get(`http://localhost:5000/products`);
    }

    //get response data
    const dataProduct = await response2.data;

    setProduct(dataProduct);
    //   dataProduct.map((product) => {
    //     return {
    //       label: `${product.name} -- (sku :${product.sku})`,
    //       value: product.id,
    //       dataName: product.name,
    //       dataPrice: product.price,
    //       dataSku: product.sku,
    //     };
    //   })
    // );
  };

  const optionList = product.map((product) => {
    return {
      label: `${product.name} -- (sku :${product.sku})`,
      value: product.id,
      dataName: product.name,
      dataPrice: product.price,
      dataSku: product.sku,
    };
  });
  console.log(optionList);
  const optionDefault = [{ label: "Select Productss", value: "null" }];
  const optionDefaults = optionDefault.concat(optionList);
  console.log(optionDefaults);

  //useEffect hook
  useEffect(() => {
    //panggil method "getOrder"
    getOrder();
  }, []);

  // fungsi untuk handle form select product
  const handleSelectProduct = async (e) => {
    if (e.value) {
      document.getElementById("quantity").disabled = false;
    } else {
      document.getElementById("quantity").disabled = true;
    }

    // set nilai max quantity menjadi 1000
    setMaxQuantity(1000);

    // jika type transaksi keluar maka maxQuantitry adalah <= jumlah stok
    if (type == "OUT") {
      const response = await axios.get(`http://localhost:5000/stock/${e.value}`);
      setMaxQuantity(response.data[0].sum);
    }

    setSelectedProduct(e.value);
    setName(e.dataName);
    setPrice(e.dataPrice);
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
        document.getElementById("quantity").disabled = true;
        setQuantity("");
        setProduct([]);
        setSelectedProduct("");
        setValidation({});
        console.log(product);
        console.log(selectedProduct);
        getOrder();
      })
      .catch((error) => {
        //assign validation on state
        setValidation(error.response.data);
      });
  };

  const deleteTransactionDetail = async (id) => {
    //sending
    await axios.delete(`http://localhost:5000/orderdetails/${id}`);

    //panggil function "getOrder"
    getOrder();
  };

  const deleteTransaction = async (id) => {
    //sending
    await axios.delete(`http://localhost:5000/orders/${id}`);

    navigate("/transaction/add");
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
          <div className="w-full relative shadow-md sm:rounded-lg bg-white border border-gray-200 p-4">
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">Add Detail Transaction</h5>
            <hr className="mb-2" />

            {/* form */}
            <form className="space-y-6 mb-4" onSubmit={storeData} id="add-form">
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

              {orderdetail.length ? (
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
                                deleteTransactionDetail(detail.id);
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
              ) : (
                ""
              )}

              <div className="flex">
                {/* <select
                  id="product"
                  name="productId"
                  onChange={handleSelectProduct}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-3"
                >
                  <option value="">Select the product</option>
                  {product.map((product) => (
                    <option key={product.id} data-name={product.name} data-price={product.price} value={product.id}>
                      {product.name} (sku: {product.sku})
                    </option>
                  ))}
                </select> */}
                <Select
                  inputId="product"
                  className="bg-gray-50 border-gray-400  text-gray-900 text-sm rounded-lg  block w-1/2 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-3"
                  options={optionDefaults}
                  placeholder={`Select Product`}
                  // value={selectedProduct || ""}
                  onChange={handleSelectProduct}
                  isSearchable={true}
                  required
                />

                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Quantity"
                  className=" border bg-white border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-1/4 p-1 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mr-3"
                  disabled
                  required
                />
                <div className="text-gray-500">Example help text goes outside the input group.</div>

                <button
                  type="submit"
                  className="w-20 text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 "
                >
                  Add
                </button>
              </div>
            </form>
            <Link
              onClick={() => {
                deleteTransaction(id);
              }}
              className="w-24 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 mt"
            >
              Back
            </Link>
            {orderdetail.length ? (
              <Link
                className="w-24 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt ml-2"
                to={`/transaction/final/${id}`}
              >
                Next
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddTransactionDetail;
