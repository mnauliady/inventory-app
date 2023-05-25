import React from "react";
//import hook useState dan useEffect from react
import { useState, useEffect } from "react";
//import axios
import axios from "axios";

//import hook history dan params dari react router dom
import { Link, useParams, useNavigate } from "react-router-dom";

import moment from "moment/moment";

import verified from "../../../asset/img/verified.gif";

import DeleteFinalModal from "./deleteFinal";

const Final = () => {
  //state
  const [code, setCode] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAdress] = useState("");
  const [orderdetail, setOrderdetail] = useState([]);
  const [total, setTotal] = useState("");

  //get ID from parameter URL
  const { id } = useParams();

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // state untuk modal delete
  const [showModalFinal, setShowModalFinal] = useState(false);
  const [statusDelete, setStatusDelete] = useState("");
  const [idDelete, setIdDelete] = useState();
  const [nameDelete, setNameDelete] = useState();

  //hook useEffect
  useEffect(() => {
    //panggil function
    getTransactionById();
  }, []);

  // fungsi menghitung total harga dari transaksi
  const totalPrice = (data) => {
    // menjumlahkan subtotal
    const subTotal = data.map((data) => data.productPrice * Math.abs(data.quantity));

    // menjumlahkan total
    const result = subTotal.reduce((prev, curr) => {
      return prev + curr;
    });

    setTotal(result);
  };

  //function "getTransactionById"
  const getTransactionById = async () => {
    try {
      //get data from server
      const response = await axios.get(`http://localhost:5000/orders/${id}`);
      //get response data
      const data = await response.data;

      //assign data to state
      setCode(data.code);
      setType(data.type);
      setDate(data.date);
      setCustomerName(data.customer.name);
      setCustomerPhone(data.customer.phone);
      setCustomerAdress(data.customer.address);
      setOrderdetail(data.orderdetail);

      // panggil fungsi totalPrice dengan parameter data.orderdetail
      totalPrice(data.orderdetail);
    } catch (error) {
      navigate("/not-found");
    }
  };

  const deleteTransaction = async (id) => {
    //sending
    // await axios.delete(`http://localhost:5000/orders/${id}`);

    // //navigate ke page transaction
    // navigate("/transaction");

    setShowModalFinal(true);
    // set id dari produk yang akan dihapus
    setIdDelete(id);
    // set status delete (jika status delete berubah maka akan menjalankan useEffect)
    setStatusDelete(false);
  };

  return (
    <section className="w-full bg-gray-100 md:h-[calc(100vh-48px)]">
      <div id="main" className="main-content flex-1 bg-gray-100 pb-24 md:pb-5">
        <div className="bg-gray-800">
          <div className="bg-blue-800 p-4 shadow text-2xl text-white ">
            <h1 className="font-bold pl-2">Transaction</h1>
          </div>
        </div>
        {/* Modal Success */}
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
                  {/* <img src={verified} alt="" /> */}
                </div>
                <h3 className="text-xl font-base mx-auto">Data Successfully Added</h3>
                <div className="text-center p-6  rounded-b">
                  <button
                    className="text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-base px-4 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-44"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      navigate("/transaction");
                    }}
                  >
                    Back to list transaction
                  </button>
                  <button
                    className="text-white bg-green-600 hover:bg-green-700 active:bg-green-700 text-base px-4 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-44"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      navigate("/transaction/add");
                    }}
                  >
                    Add New Transaction
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Modal delete */}
        {showModalFinal && (
          <DeleteFinalModal id={id} setStatusDelete={setStatusDelete} setShowModalFinal={setShowModalFinal} />
        )}

        <div className="flex flex-wrap mt-8 mx-8 mb-4">
          <div className="overflow-hidden bg-white shadow sm:rounded-lg w-full">
            <div className="px-4 py-5 sm:px-6 bg-gray-200">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Detail of Transaction</h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="border-b-2 border-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Code</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{code}</dd>
                </div>
                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{moment(date).format("LL")}</dd>
                </div>
                <h3 className="text-base font-semibold leading-6 text-gray-900 px-4 py-3 sm:gap-4 sm:px-6 bg-gray-200">
                  {type == "OUT" ? "Receiver" : "Sender"}
                </h3>
                <div className="border-b-2 border-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{customerName}</dd>
                </div>
                <div className="border-b-2 border-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{customerPhone}</dd>
                </div>
                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{customerAddress}</dd>
                </div>
              </dl>
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className=" text-sm text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
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
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Subtotal
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
                      <td className="px-6 py-4">Rp {detail.productPrice.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        Rp {(detail.productPrice * Math.abs(detail.quantity)).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-200">
                    <td scope="row" className="px-6 py-4" colSpan={3}></td>
                    <td className="text-base font-semibold leading-6 text-gray-900 px-4 py-2 sm:gap-2 sm:px-6">
                      Total
                    </td>
                    <td className="text-base font-semibold leading-6 text-gray-900 px-4 py-2 sm:gap-2 sm:px-6">
                      Rp {total.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Link
          to={`/transaction/add/detail/${id}`}
          className=" text-white bg-gray-500 hover:bg-gray-600 rounded-md font-medium text-sm px-5 py-2.5 ml-8"
        >
          Back
        </Link>
        <Link
          onClick={() => {
            // if (window.confirm("Cancel the transaction?")) {
            //   deleteTransaction(id);
            // }
            deleteTransaction(id);
          }}
          className=" text-white bg-red-500 hover:bg-red-600 rounded-md font-medium text-sm px-5 py-2.5 ml-2"
        >
          Cancel Transaction
        </Link>
        <Link
          // to="/transaction"
          onClick={() => {
            setShowModal(true);
          }}
          className=" text-white bg-blue-500 hover:bg-blue-600 rounded-md font-medium text-sm px-5 py-2.5 ml-2"
        >
          Ok
        </Link>
      </div>
    </section>
  );
};

export default Final;
