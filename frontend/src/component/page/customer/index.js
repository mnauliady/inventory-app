import React from "react";
//import hook useState dan useEffect from react
import { useState, useEffect } from "react";
//import axios
import axios from "axios";
// import Link
import { Link, useNavigate } from "react-router-dom";

import jwtDecode from "jwt-decode";

import DeleteModal from "./deleteModal";
import AddModal from "./addModal";
import EditModal from "./editModal";

// import alert/flash message
import AddAlert from "../../Alert/addAlert";
import EditAlert from "../../Alert/editAlert";
import DeleteAlert from "../../Alert/deleteAlert";

import ReactPaginate from "react-paginate";

const Customer = () => {
  const navigate = useNavigate();

  // token access for header Authorization
  const [token, setToken] = useState("");
  // token expire
  const [expire, setExpire] = useState("");

  //define state
  const [customers, setCustomers] = useState([]);

  // state pagination dan search
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");

  // state untuk modal add
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [statusAdd, setStatusAdd] = useState("");

  // state untuk modal edit
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [statusEdit, setStatusEdit] = useState("");

  // state untuk modal delete
  const [showModal, setShowModal] = useState(false);
  const [statusDelete, setStatusDelete] = useState("");
  const [idCustomer, setIdCustomer] = useState();
  const [nameDelete, setNameDelete] = useState();

  //useEffect hook
  useEffect(() => {
    // jalankan refresh token untuk mengambil token dan expired
    refreshToken();
    //panggil method "fetchData"
    fectData();
  }, [statusDelete, statusAdd, statusEdit, page, keyword]);

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
      `http://localhost:5000/customers?search_query=${keyword}&page=${page}&limit=${limit}`,
      // { withCredentials: true },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    //get response
    const data = await response.data.customer;

    //assign response data to state "customers"
    setCustomers(data);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
  };

  const changePage = ({ selected }) => {
    setPage(selected);
    if (selected === 9) {
      setMsg("Jika tidak menemukan data yang Anda cari, silahkan cari data dengan kata kunci spesifik!");
    } else {
      setMsg("");
    }
  };

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setMsg("");
    setKeyword(query);
  };

  const addCustomer = () => {
    setShowModalAdd(true);
    setStatusAdd(false);
  };

  const editCustomer = (id) => {
    setIdCustomer(id);
    setShowModalEdit(true);
    setStatusEdit(false);
  };

  const deleteCustomer = (id, nama) => {
    //sending
    // set modal ke true
    setShowModal(true);
    // set id dari produk yang akan dihapus
    setIdCustomer(id);
    // set nama produk yang akan dihapus
    setNameDelete(nama);
    // set status delete (jika status delete berubah maka akan menjalankan useEffect)
    setStatusDelete(false);
  };

  return (
    // index page
    <section className="w-full bg-gray-100 md:h-[calc(100vh-48px)]">
      <div id="main" className=" main-content bg-gray-100 flex-1 pb-24 md:pb-0">
        <div className="bg-gray-800">
          <div className=" bg-blue-800 p-4 shadow text-2xl text-white">
            <h1 className="font-bold pl-2">Customer</h1>
          </div>
        </div>

        {/* Modal add */}
        {showModalAdd && <AddModal setStatusAdd={setStatusAdd} setShowModalAdd={setShowModalAdd} />}

        {/* Modal Edit */}
        {showModalEdit && (
          <EditModal id={idCustomer} setStatusEdit={setStatusEdit} setShowModalEdit={setShowModalEdit} />
        )}

        {showModal && (
          <DeleteModal
            id={idCustomer}
            name={nameDelete}
            setStatusDelete={setStatusDelete}
            setShowModal={setShowModal}
          />
        )}

        {statusAdd && <AddAlert setStatusAdd={setStatusAdd}></AddAlert>}
        {statusEdit && <EditAlert setStatusEdit={setStatusEdit} message={`Data Successfully Updated`}></EditAlert>}
        {statusDelete && <DeleteAlert setStatusDelete={setStatusDelete}></DeleteAlert>}

        {/* button Add */}
        <div className="flex flex-wrap mt-8 mx-8">
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={() => addCustomer()}
          >
            Add Customer
          </button>
        </div>

        <form onKeyUp={searchData}>
          <div className="mx-8 flex mb-2">
            <div className="mr-2">
              <input
                type="text"
                className="py-1.5 rounded-md pl-2 w-80 border-2 border-gray-300 bg-gray-50 border-solid focus:border-blue-700"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ... "
              />
            </div>
          </div>
        </form>

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
                    Email
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
                    <td className="px-6 py-4">{customer.email}</td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/customer/${customer.id}`}
                        className="text-white bg-green-700 hover:bg-green-800 rounded-md text-sm px-2 py-1.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700"
                      >
                        Detail
                      </Link>
                      <Link
                        onClick={() => {
                          editCustomer(customer.id);
                        }}
                        className=" text-white bg-yellow-500 hover:bg-yellow-600 rounded-md text-sm px-2 py-1.5 mr-2 mb-2 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                      >
                        Edit
                      </Link>
                      {!customer.order.length ? (
                        <Link
                          onClick={() => {
                            deleteCustomer(customer.id, customer.name);
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

        <div className="flex pt-2">
          <p className="text-red-500">{msg}</p>
          <p className="flex ml-8 pt-1 font-medium">
            Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
          </p>
          <nav className="text-center ml-auto mr-8" key={rows} role="navigation" aria-label="pagination">
            <ReactPaginate
              previousLabel={"< Prev"}
              nextLabel={"Next >"}
              pageCount={Math.min(10, pages)}
              onPageChange={changePage}
              containerClassName={"isolate inline-flex -space-x-px rounded-md shadow-sm"}
              pageLinkClassName={
                "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-600 ring-1 ring-inset ring-blue-300 hover:bg-blue-200 focus:z-20 focus:outline-offset-0"
              }
              previousLinkClassName={
                "relative inline-flex items-center rounded-l-md text-sm px-4 py-2 text-blue-600 font-semibold ring-1 ring-inset hover:bg-blue-200 ring-blue-300 focus:z-20 focus:outline-offset-0"
              }
              nextLinkClassName={
                "relative inline-flex items-center rounded-r-md text-sm px-4 py-2 text-blue-600 font-semibold ring-1 ring-inset hover:bg-blue-200 ring-blue-300 focus:z-20 focus:outline-offset-0"
              }
              activeLinkClassName={
                "relative inline-flex items-center bg-blue-700 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2"
              }
              disabledLinkClassName={""}
            />
          </nav>
        </div>
      </div>
    </section>
  );
};

export default Customer;
