import React from "react";
//import hook useState dan useEffect from react
import { useState, useEffect } from "react";
//import axios
import axios from "axios";

import moment from "moment/moment";

import ReactPaginate from "react-paginate";

const Log = () => {
  //define state
  const [logs, setLogs] = useState([]);

  // state pagination dan search
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState();
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");
  const [level, setLevel] = useState("");
  const [method, setMethod] = useState("");

  //useEffect hook
  useEffect(() => {
    //panggil method "fetchData"
    fectData();
  }, [page, keyword, level, method]);

  //function "fetchData"
  const fectData = async () => {
    //fetching
    // const response = await axios.get(`http://localhost:5000/log`);
    const response = await axios.get(
      `http://localhost:5000/log?page=${page}&search_query=${keyword}&method=${method}&level=${level}`
    );
    //get response data
    const data = await response.data.data;

    //assign response data to state "logs"
    setLogs(data);
    setPage(response.data.page);
    setPages(response.data.total_pages);
    setRows(response.data.total);
  };

  const changePage = ({ selected }) => {
    setPage(selected);
    // if (selected === 9) {
    //   setMsg("Jika tidak menemukan data yang Anda cari, silahkan cari data dengan kata kunci spesifik!");
    // } else {
    //   setMsg("");
    // }
  };

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setMsg("");
    setKeyword(query);
    setLevel(level);
    setMethod(method);
  };

  return (
    <section className="w-full bg-gray-100 md:h-[calc(100vh-48px)] ">
      <div id="main" className=" main-content flex-1 bg-gray-100 pb-24">
        <div className="bg-gray-800">
          <div className=" bg-blue-800 p-4 shadow text-2xl text-white">
            <h1 className="font-bold pl-2">App Log</h1>
          </div>
        </div>

        <form onKeyUp={searchData}>
          <div className="mx-8 flex mt-8">
            {/* <div className="mr-2">
              <input
                type="text"
                className=" py-1.5 rounded-md pl-2 w-80 border-2 border-gray-300 bg-gray-50 border-solid focus:border-blue-700"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ... "
              />
            </div> */}
            <div className="flex mb-2">
              <div className="mr-2">
                <select
                  onChange={(e) => setLevel(e.target.value)}
                  value={level}
                  className="py-1.5 rounded-md pl-2 w-44 border-2 border-gray-300 bg-gray-50 border-solid focus:border-blue-700"
                >
                  <option value="">All Level</option>
                  <option value="info">Info</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </div>
            <div className="flex mb-2">
              <div className="mr-2">
                <select
                  onChange={(e) => setMethod(e.target.value)}
                  value={method}
                  className="py-1.5 rounded-md pl-2 w-44 border-2 border-gray-300 bg-gray-50 border-solid focus:border-blue-700"
                >
                  <option value="">All Method</option>
                  <option value="get">GET</option>
                  <option value="post">POST</option>
                  <option value="put">PUT</option>
                  <option value="delete">DELETE</option>
                </select>
              </div>
            </div>
            {/* <div className="">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm py-2.5 px-4 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Search
              </button>
            </div> */}
          </div>
        </form>

        {/* Table */}
        <div className="flex flex-wrap mx-8 mt-2">
          <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className=" text-sm text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Level
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Method
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Message
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l, index) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={index}
                  >
                    <td className="px-6 py-2">{l.level}</td>
                    <td className="px-6 py-2">{l.method}</td>
                    <td className="px-6 py-2">{l.message}</td>
                    <td className="px-6 py-2">{moment(l.timestamp).format("LL, hh:mm:ss a")}</td>
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
              pageCount={Math.min(pages, pages)}
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
              breakClassName={"text-gray-100"}
            />
          </nav>
        </div>
      </div>
    </section>
  );
};

export default Log;
