import React from "react";

//import hook useState from react
import { useState, useEffect } from "react";

//import axios
import axios from "axios";

//import hook history dari react router dom
import { useNavigate, Link, useParams } from "react-router-dom";

const EditCustomer = () => {
  //useEffect hook
  useEffect(() => {
    //panggil function "getPOstById"
    getCustomerById();
  }, []);

  //get ID from parameter URL
  const { id } = useParams();

  //function "getCustomerById"
  const getCustomerById = async () => {
    try {
      //get data from server
      const response = await axios.get(`http://localhost:5000/customers/${id}`);
      //get response data
      const data = await response.data;
      //assign data to state
      setName(data.name);
      setPhone(data.phone);
      setEmail(data.email);
      setAddress(data.address);
    } catch (error) {
      // jika id (tidak ditemukan maka akan redirect ke blank page)
      navigate("/not-found");
    }
  };

  // Proses Update data ===================================
  //state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  //state validation
  const [validation, setValidation] = useState({});

  const navigate = useNavigate();

  //function "updateCustomer"
  const updateCustomer = async (e) => {
    e.preventDefault();

    //send data to server
    await axios
      .put(`http://localhost:5000/customers/${id}`, {
        name,
        phone,
        email,
        address,
      })
      .then(() => {
        //redirect ke halaman customer
        navigate("/customer");
      })
      .catch((error) => {
        //assign validation on state
        setValidation(error.response.data);
      });
  };

  return (
    <section className="w-full md:h-[calc(100vh-48px)] bg-gray-100">
      <div id="main" className="main-content bg-gray-100 flex-1 pb-24 md:pb-5">
        <div className="bg-gray-800 pt-3">
          <div className=" bg-blue-800 p-4 shadow text-2xl text-white">
            <h1 className="font-bold pl-2">Customer</h1>
          </div>
        </div>

        {/* form */}
        <div className="flex flex-wrap mx-8 mt-8">
          <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg bg-white border border-gray-200 p-4">
            <form className="space-y-6" onSubmit={updateCustomer}>
              <h5 className="text-xl font-medium text-gray-900 dark:text-white">Edit Customer</h5>
              <hr />

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

              {/* Name */}
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Customer Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Phone
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="text"
                  name="phone"
                  id="phone"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Address
                </label>
                <textarea
                  id="address"
                  rows="2"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="block p-2.5 w-1/2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                ></textarea>
              </div>

              <Link
                to="/customer"
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

export default EditCustomer;
