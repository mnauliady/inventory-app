import React from "react";
//import hook useState dan useEffect from react
import { useState, useEffect } from "react";
//import axios
import axios from "axios";
// import Link
import { useNavigate, Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import DeleteModal from "./deleteModal";

import AddModal from "./addModal";

import ResetPasswordModal from "./resetPassModal";

import ReactPaginate from "react-paginate";

const User = () => {
  //define state
  const [users, setUsers] = useState([]);

  // state untuk modal add
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [statusAdd, setStatusAdd] = useState("");

  // state untuk modal delete
  const [showModal, setShowModal] = useState(false);
  const [statusDelete, setStatusDelete] = useState("");
  const [idDelete, setIdDelete] = useState();
  const [nameDelete, setNameDelete] = useState();

  // state untuk modal reset pass
  const [showModalReset, setShowModalReset] = useState(false);
  const [statusReset, setStatusReset] = useState("");
  const [idReset, setIdReset] = useState();
  const [nameReset, setNameReset] = useState();

  // state pagination dan search
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");

  const { isError, user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  //useEffect hook
  useEffect(() => {
    //panggil method "fetchData"
    if (isError) {
      navigate("/login");
    }
    if (user && user.role !== "super admin") {
      navigate("/forbidden");
    }

    fectData();
  }, [isError, user, navigate, statusDelete, statusReset, statusAdd, page, keyword]);

  //function "fetchData"
  const fectData = async () => {
    //fetching
    const response = await axios.get(`http://localhost:5000/users?search_query=${keyword}&page=${page}&limit=${limit}`);
    //get response data
    const data = await response.data.user;
    //assign response data to state "users"
    setUsers(data);
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

  const deleteUser = (id, nama) => {
    //sending
    // set modal ke true
    setShowModal(true);
    // set id dari produk yang akan dihapus
    setIdDelete(id);
    // set nama produk yang akan dihapus
    setNameDelete(nama);
    // set status delete (jika status delete berubah maka akan menjalankan useEffect)
    setStatusDelete(false);
  };

  const resetPass = (id, nama) => {
    //sending
    // set modal ke true
    setShowModalReset(true);
    // set id dari produk yang akan dihapus
    setIdReset(id);
    // set nama produk yang akan dihapus
    setNameReset(nama);
    // set status delete (jika status delete berubah maka akan menjalankan useEffect)
    setStatusReset(false);
  };

  const addUser = () => {
    setShowModalAdd(true);
    setStatusAdd(false);
  };

  return (
    // index page
    <section className="w-full bg-gray-100 md:h-[calc(100vh-48px)]">
      <div id="main" className="main-content flex-1 bg-gray-100 pb-24 md:pb-5">
        <div className="bg-gray-800">
          <div className=" bg-blue-800 p-4 shadow text-2xl text-white">
            <h1 className="font-bold pl-2">User</h1>
          </div>
        </div>

        {/* Modal add */}
        {showModalAdd && <AddModal setStatusAdd={setStatusAdd} setShowModalAdd={setShowModalAdd} />}

        {showModal && (
          <DeleteModal id={idDelete} name={nameDelete} setStatusDelete={setStatusDelete} setShowModal={setShowModal} />
        )}

        {showModalReset && (
          <ResetPasswordModal
            id={idReset}
            name={nameReset}
            setStatusReset={setStatusReset}
            setShowModalReset={setShowModalReset}
          />
        )}

        {/* button Add */}
        <div className="flex flex-wrap mt-8 mx-8">
          <Link
            onClick={() => addUser()}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Add User
          </Link>
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
          <div className=" relative overflow-x-auto shadow-md sm:rounded-lg w-full">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className=" text-sm text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={user.id}
                  >
                    <td scope="row" className="px-6 py-4  whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4 capitalize">{user.role}</td>
                    <td className="px-6 py-4">
                      <Link
                        onClick={() => {
                          resetPass(user.id, user.email);
                        }}
                        className=" text-white bg-yellow-500 hover:bg-yellow-600 rounded-md text-sm px-2 py-1.5 mr-2 mb-2 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                      >
                        Reset Password
                      </Link>
                      {user.order.length ? (
                        ""
                      ) : (
                        <Link
                          onClick={() => {
                            deleteUser(user.id, user.email);
                          }}
                          className=" text-white bg-red-500 hover:bg-red-600 rounded-md text-sm px-2 py-1.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-res-700"
                        >
                          Delete
                        </Link>
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

export default User;
