import React from "react";

//import hook useState from react
import { useState, useEffect } from "react";

//import axios
import axios from "axios";

//import hook history dari react router dom
import { useNavigate, Link } from "react-router-dom";

const ChangePasswordModal = ({ id, setStatusChangePass, setShowModalChangePass }) => {
  //state
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const [passwordShown, setPasswordShown] = useState(false);
  const [newPasswordShown, setNewPasswordShown] = useState(false);
  const [confPasswordShown, setConfPasswordShown] = useState(false);

  //state validation
  const [validation, setValidation] = useState({});

  useEffect(() => {
    if (passwordShown) {
      setTimeout(() => {
        setPasswordShown(!passwordShown);
      }, 1000);
    }

    if (newPasswordShown) {
      setTimeout(() => {
        setNewPasswordShown(!newPasswordShown);
      }, 1000);
    }

    if (confPasswordShown) {
      setTimeout(() => {
        setConfPasswordShown(!confPasswordShown);
      }, 1000);
    }
  }, [passwordShown, newPasswordShown, confPasswordShown]);

  const changePassword = async (e) => {
    e.preventDefault();

    //send data to server
    await axios
      .put(`http://localhost:5000/users/change/${id}`, {
        password,
        newPassword,
        confPassword,
      })
      .then(() => {
        //redirect ke halaman category
        setShowModalChangePass(false);

        setStatusChangePass(true);
      })
      .catch((error) => {
        //assign validation on state
        setValidation(error.response.data);
      });
  };

  // Password toggle handler
  const togglePassword = (e) => {
    e.preventDefault();
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };

  // Password toggle handler
  const toggleNewPassword = (e) => {
    e.preventDefault();
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setNewPasswordShown(!newPasswordShown);
  };

  // Password toggle handler
  const toggleConfPassword = (e) => {
    e.preventDefault();
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setConfPasswordShown(!confPasswordShown);
  };

  return (
    <>
      {/* <div className="bg-transparent z-10 w-full md:h-[calc(100vh-48px)]"> */}
      <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur-sm bg-white/30">
        <div className="relative w-1/4 my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-300 drop-shadow-2xl  outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-700 rounded-t ">
              <h3 className="text-xl font-base">Change Password</h3>
              <button className="bg-transparent -mt-5 -mr-2" onClick={() => setShowModalChangePass(false)}>
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
              <form className="space-y-4 w-full" onSubmit={changePassword}>
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

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                    Old Password
                  </label>
                  <div className="flex">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={passwordShown ? "text" : "password"}
                      name="password"
                      id="password"
                      className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                    <button className=" -ml-10" onClick={togglePassword}>
                      {passwordShown ? (
                        <i className="fa-solid fa-eye" style={{ color: "#9ca3af" }}></i>
                      ) : (
                        <i className="fa-solid fa-eye-slash" style={{ color: "#9ca3af" }}></i>
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                    New Password
                  </label>
                  <div className="flex">
                    <input
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type={newPasswordShown ? "text" : "password"}
                      name="newPassword"
                      id="newPassword"
                      className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 flex w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                    <button className=" -ml-10" onClick={toggleNewPassword}>
                      {newPasswordShown ? (
                        <i className="fa-solid fa-eye" style={{ color: "#9ca3af" }}></i>
                      ) : (
                        <i className="fa-solid fa-eye-slash" style={{ color: "#9ca3af" }}></i>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confPassword"
                    className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm Password
                  </label>
                  <div className="flex">
                    <input
                      value={confPassword}
                      onChange={(e) => setConfPassword(e.target.value)}
                      type={confPasswordShown ? "text" : "password"}
                      name="confPassword"
                      id="confPassword"
                      className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 flex w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                    <button className="-ml-10" onClick={toggleConfPassword}>
                      {confPasswordShown ? (
                        <i className="fa-solid fa-eye" style={{ color: "#9ca3af" }}></i>
                      ) : (
                        <i className="fa-solid fa-eye-slash" style={{ color: "#9ca3af" }}></i>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end pb-6 rounded-b">
                  <button
                    className="text-white bg-red-500 hover:bg-red-600 active:bg-red-700 text-base px-4 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModalChangePass(false)}
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
      {/* </div> */}
    </>
  );
};

export default ChangePasswordModal;
