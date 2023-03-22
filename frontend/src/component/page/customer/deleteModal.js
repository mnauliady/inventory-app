import React, { useState } from "react";
import axios from "axios";

const DeleteModal = ({ id, name, setStatusDelete, setShowModal }) => {
  const deleteCustomer = async () => {
    // sending
    await axios.delete(`http://localhost:5000/customers/${id}`);

    setShowModal(false);

    setStatusDelete(true);
  };

  return (
    <>
      <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-transparent">
        <div className="relative w-2/5 my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-slate-300 drop-shadow-2xl bg-opacity-50 backdrop-blur outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-700 rounded-t ">
              <h3 className="text-xl font-base">
                Delete Customer <span className="font-semibold">{name}</span>?
              </h3>
              <button className="bg-transparent -mt-5 -mr-2" onClick={() => setShowModal(false)}>
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
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-base px-4 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="text-white bg-red-500 hover:bg-red-600 active:bg-red-700 text-base px-4 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                type="button"
                onClick={() => deleteCustomer()}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
