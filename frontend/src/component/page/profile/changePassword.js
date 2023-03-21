import React from "react";

//import hook useState from react
import { useState, useEffect } from "react";

//import axios
import axios from "axios";

//import hook history dari react router dom
import { useNavigate, Link, useParams } from "react-router-dom";

import { useSelector } from "react-redux";

const ChangePassword = () => {
  //state
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  //state validation
  const [validation, setValidation] = useState({});

  const navigate = useNavigate();

  //useEffect hook
  useEffect(() => {
    getProfileById();
  }, []);

  //get ID from parameter URL
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  const getProfileById = async () => {
    try {
      if (id !== user.id) {
        navigate("/not-found");
      }
    } catch (error) {
      // jika id (tidak ditemukan maka akan redirect ke blank page)
      navigate("/not-found");
    }
  };

  // Proses Update data ===================================

  //function "changePassword"
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
        //redirect ke halaman profile
        navigate(`/profile/${id}`);
      })
      .catch((error) => {
        //assign validation on state
        setValidation(error.response.data);
      });
  };

  return (
    <section className="w-full bg-gray-100 md:h-[calc(100vh-48px)]">
      <div id="main" className="main-content flex-1 bg-gray-100 pb-24 md:pb-5">
        <div className="bg-gray-800 pt-3">
          <div className=" bg-blue-800 p-4 shadow text-2xl text-white">
            <h1 className="font-bold pl-2">Profile</h1>
          </div>
        </div>

        {/* form */}
        <div className="flex flex-wrap mx-8 mt-8">
          <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg bg-white border border-gray-200 p-4">
            <form className="space-y-6" onSubmit={changePassword}>
              <h5 className="text-xl font-medium text-gray-900 dark:text-white">Change Password</h5>
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
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Old Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  New Password
                </label>
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Confirm New Password
                </label>
                <input
                  value={confPassword}
                  onChange={(e) => setConfPassword(e.target.value)}
                  type="password"
                  name="confPassword"
                  id="confPassword"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                />
              </div>

              <Link
                to={`/profile/${id}`}
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

export default ChangePassword;
