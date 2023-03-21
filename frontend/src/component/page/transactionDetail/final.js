import React from "react";
//import hook useState dan useEffect from react
import { useState, useEffect } from "react";
//import axios
import axios from "axios";

//import hook history dan params dari react router dom
import { Link, useParams, useNavigate } from "react-router-dom";

import moment from "moment/moment";

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
    await axios.delete(`http://localhost:5000/orders/${id}`);

    //navigate ke page transaction
    navigate("/transaction");
  };

  return (
    <section className="w-full bg-gray-100 md:h-[calc(100vh-48px)]">
      <div id="main" className="main-content flex-1 bg-gray-100 pb-24 md:pb-5">
        <div className="bg-gray-800 pt-3">
          <div className="bg-blue-800 p-4 shadow text-2xl text-white ">
            <h1 className="font-bold pl-2">Transaction</h1>
          </div>
        </div>

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
            if (window.confirm("Cancel the transaction?")) {
              deleteTransaction(id);
            }
          }}
          className=" text-white bg-red-500 hover:bg-red-600 rounded-md font-medium text-sm px-5 py-2.5 ml-2"
        >
          Cancel Transaction
        </Link>
        <Link
          to="/transaction"
          className=" text-white bg-blue-500 hover:bg-blue-600 rounded-md font-medium text-sm px-5 py-2.5 ml-2"
        >
          Ok
        </Link>
      </div>
    </section>
  );
};

export default Final;
