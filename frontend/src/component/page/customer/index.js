import React from "react";
//import hook useState dan useEffect from react
import { useState, useEffect } from "react";
//import axios
import axios from "axios";
// import Link
import { Link, useNavigate } from "react-router-dom";

import jwtDecode from "jwt-decode";

const Customer = () => {
  const navigate = useNavigate();

  // token access for header Authorization
  const [token, setToken] = useState("");
  // token expire
  const [expire, setExpire] = useState("");

  //define state
  const [customers, setCustomers] = useState([]);

  //useEffect hook
  useEffect(() => {
    // jalankan refresh token untuk mengambil token dan expired
    refreshToken();
    //panggil method "fetchData"
    fectData();
  }, []);

  // get fresh access token
  const axiosJWT = axios.create();

  const refreshToken = async () => {
    try {
      // ambil token user
      const response = await axios.get("http://localhost:5000/token", {
        withCredentials: true,
      });

      setToken(response.data.accessToken);
      // decode dari token yang sudah diambil
      const decoded = jwtDecode(response.data.accessToken);
      // set expire token
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("http://localhost:5000/token", { withCredentials: true });
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;

        setToken(response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);

        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // const tokens = () => {
  //   (async () => {
  //     try {
  //       // ambil token user
  //       const response = await axios.get("http://localhost:5000/token", {
  //         withCredentials: true,
  //       });

  //       setToken(response.data.accessToken);
  //       // decode dari token yang sudah diambil
  //       const decoded = jwtDecode(response.data.accessToken);
  //       // set expire token
  //       setExpire(decoded.exp);
  //     } catch (error) {
  //       if (error.response) {
  //         navigate("/");
  //       }
  //     }
  //   })();

  //   const axiosJWT = axios.create();

  //   axiosJWT.interceptors.request.use(
  //     async (config) => {
  //       const currentDate = new Date();
  //       if (expire * 1000 < currentDate.getTime()) {
  //         const response = await axios.get("http://localhost:5000/token", { withCredentials: true });
  //         config.headers.Authorization = `Bearer ${response.data.accessToken}`;

  //         setToken(response.data.accessToken);
  //         const decoded = jwtDecode(response.data.accessToken);

  //         setExpire(decoded.exp);
  //       }
  //       return config;
  //     },
  //     (error) => {
  //       return Promise.reject(error);
  //     }
  //   );
  // };

  //function "fetchData"
  const fectData = async () => {
    //fetching
    const response = await axiosJWT(
      "http://localhost:5000/customers",
      // { withCredentials: true },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    //get response
    const data = await response.data;

    //assign response data to state "customers"
    setCustomers(data);
  };

  const deleteCustomer = async (id) => {
    //sending
    await axios.delete(`http://localhost:5000/customers/${id}`);

    //panggil function "fetchData"
    fectData();
  };

  return (
    // index page
    <section className="w-full">
      <div id="main" className="h-full main-content flex-1 bg-gray-100 mt-12 md:mt-2 pb-24 md:pb-5">
        <div className="bg-gray-800 pt-3">
          <div className=" bg-blue-800 p-4 shadow text-2xl text-white">
            <h1 className="font-bold pl-2">Customer</h1>
          </div>
        </div>

        {/* button Add */}
        <div className="flex flex-wrap mt-8 mx-8">
          <Link
            to="/customer/add"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Add Customer
          </Link>
        </div>

        {/* Table */}
        <div className="flex flex-wrap mx-8">
          <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className=" text-sm text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Customer Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={customer.id}
                  >
                    <td scope="row" className="px-6 py-4  whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">{customer.name}</td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/customer/${customer.id}`}
                        className="text-white bg-green-700 hover:bg-green-800 rounded-md text-sm px-2 py-1.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700"
                      >
                        Detail
                      </Link>
                      <Link
                        to={`/customer/edit/${customer.id}`}
                        className=" text-white bg-yellow-500 hover:bg-yellow-600 rounded-md text-sm px-2 py-1.5 mr-2 mb-2 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                      >
                        Edit
                      </Link>
                      {!customer.order.length ? (
                        <Link
                          onClick={() => {
                            if (window.confirm("Delete the item?")) {
                              deleteCustomer(customer.id);
                            }
                          }}
                          className=" text-white bg-red-500 hover:bg-red-600 rounded-md text-sm px-2 py-1.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-res-700"
                        >
                          Delete
                        </Link>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <nav aria-label="Page navigation example" className="pt-6 text-center">
          <ul className="inline-flex -space-x-px">
            <li>
              <a
                href="#"
                className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Previous
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                1
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                2
              </a>
            </li>
            <li>
              <a
                href="#"
                aria-current="page"
                className="px-3 py-2 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              >
                3
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                4
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                5
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default Customer;
