import React from "react";

//import hook useState from react
import { useState, useEffect } from "react";

//import axios
import axios from "axios";

//import hook history dari react router dom
import { useNavigate, Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const AddTransaction = () => {
  // Proses Add data ===================================
  //state
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [customer, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState();

  // state validation
  const [validation, setValidation] = useState({});

  const navigate = useNavigate();

  //useEffect hook
  useEffect(() => {
    //panggil method "dataCustomer"
    // dataCustomer();
  }, []);

  const handleSelectCustomer = (e) => {
    setSelectedCustomer(e.target.value);
  };

  // fungsi untuk handle form select supplier=
  const handleTypeTransaction = async (e) => {
    setType(e.target.value);

    if (e.target.value) {
      document.getElementById("customer").disabled = false;
    } else {
      document.getElementById("customer").disabled = true;
    }

    const response = await axios.get(`http://localhost:5000/customers/type/${e.target.value}`);

    //get response data
    const data = await response.data;

    //assign response data to state "customer"
    setCustomer(data);
  };

  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();

  //method "storeTransaction"
  const storeTransaction = async (e) => {
    e.preventDefault();

    //send data to server
    await axios
      .post("http://localhost:5000/orders", {
        type,
        // date,
        userId: user.id,
        customerId: selectedCustomer,
      })
      .then(async () => {
        //redirect ke halaman transaction
        //get ID from parameter URL
        const response = await axios.get(`http://localhost:5000/orderlast`);
        const id = response.data.id;
        navigate(`/transaction/add/detail/${id}`);
      })
      .catch((error) => {
        //assign validation on state
        setValidation(error.response.data);
      });
  };

  return (
    <section className="w-full bg-gray-100 md:h-[calc(100vh-48px)]">
      <div id="main" className="main-content flex-1 bg-gray-100 pb-24 md:pb-5">
        <div className="bg-gray-800">
          <div className=" bg-blue-800 p-4 shadow text-2xl text-white">
            <h1 className="font-bold pl-2">Transaction</h1>
          </div>
        </div>

        {/* form */}
        <div className="flex flex-wrap mx-8 mt-8">
          <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg bg-white border border-gray-200 p-4">
            <form className="space-y-6" onSubmit={storeTransaction}>
              <h5 className="text-xl font-medium text-gray-900 dark:text-white">Add New Transaction</h5>
              <hr />

              {/* error handling */}
              {validation.errors && (
                <div className="bg-red-500 rounded-md w-1/2">
                  <ul className="py-2 px-4 text-white">
                    {validation.errors.map((error, index) => (
                      <li key={index}>
                        <span className="">{error.msg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="w-full md:flex">
                {/* Transaction Type */}
                <div className="w-full md:w-1/3 mr-2">
                  <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Select transaction
                  </label>
                  <select
                    id="type"
                    name="type"
                    onChange={handleTypeTransaction}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="">Select the transaction type</option>
                    <option value="IN">IN</option>
                    <option value="OUT">OUT</option>
                  </select>
                </div>

                {/* date */}
                {/* <div className="w-full md:w-1/3 mr-2">
                  <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Date
                  </label>
                  <input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    type="date"
                    name="date"
                    id="date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div> */}

                {/* Customer */}
                <div className="w-full md:w-1/3">
                  <label htmlFor="customer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Select the customer/supplier
                  </label>
                  <select
                    id="customer"
                    name="customerId"
                    onChange={handleSelectCustomer}
                    disabled
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="">Select the customer/supplier</option>
                    {customer.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Link
                to="/transaction"
                className=" text-white bg-gray-500 hover:bg-gray-600 rounded-md font-medium text-sm px-5 py-2.5 mr-2 mb-2"
              >
                Back
              </Link>
              <button
                type="submit"
                className="w-24 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Next
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddTransaction;
