import React from "react";

//import hook useState from react
import { useState, useEffect } from "react";

//import axios
import axios from "axios";

//import hook history dari react router dom
import { useNavigate, Link } from "react-router-dom";

const EditModal = ({ id, setStatusEdit, setShowModalEdit }) => {
  //state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  //state validation
  const [validation, setValidation] = useState({});

  const navigate = useNavigate();

  //useEffect hook
  useEffect(() => {
    //panggil function "getPOstById"
    getCustomerById();
  }, []);

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

  const editCustomer = async (e) => {
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
        //redirect ke halaman category
        setShowModalEdit(false);

        setStatusEdit(true);
      })
      .catch((error) => {
        //assign validation on state
        setValidation(error.response.data);
      });
  };

  return (
    <>
      <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-transparent">
        <div className="relative w-2/5 my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-slate-300 drop-shadow-2xl bg-opacity-50 backdrop-blur outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-700 rounded-t ">
              <h3 className="text-xl font-base">Edit Customer</h3>
              <button className="bg-transparent -mt-5 -mr-2" onClick={() => setShowModalEdit(false)}>
                <span className="absolute mt-3 right-2 p-0.5 bg-red-500 rounded-full text-white hover:bg-red-600">
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
            </div>

            <div className="flex flex-wrap mx-8 mt-4">
              <form className="space-y-4 w-full" onSubmit={editCustomer}>
                {/* error handling */}
                {validation.errors && (
                  <div className="bg-red-500 rounded-md w-full">
                    <ul className="py-2 px-4 text-white">
                      {validation.errors.map((error, index) => (
                        <li key={index}>
                          <span className="">{error.msg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Customer Name */}
                <div>
                  <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                    Customer Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                    Phone
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="text"
                    name="phone"
                    id="phone"
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                    Address
                  </label>
                  <textarea
                    id="address"
                    rows="2"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-100 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end pb-6 rounded-b">
                  <button
                    className="text-white bg-red-500 hover:bg-red-600 active:bg-red-700 text-base px-4 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModalEdit(false)}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-base px-4 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditModal;
