import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import loginImage from "../asset/img/login.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const Auth = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      navigate("/");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div className="bg-gray-200 w-full h-full">
      <div className="w-1/2 m-auto py-36 md:flex">
        <div className="relative oferflow-hidden md:flex w-1/2 rounded-l-lg bg-blue-300 py-6 hidden ">
          <img src={loginImage} alt="login" />
        </div>
        <div className="flex md:w-1/2 justify-center py-10 items-center bg-gray-50 rounded-lg md:rounded-r-lg md:rounded-l-none ">
          <form className="bg-gray-50" onSubmit={Auth}>
            <h1 className="text-gray-800 font-bold text-2xl mb-1">Welcome Back</h1>
            <p className="text-sm font-normal text-gray-600 mb-7">Login to your account</p>
            {/* <div className="flex items-center border-2 py-2 px-3 rounded-md mb-4">
              <input className="pl-2 outline-none border-none" type="email" name="" id="" placeholder="Full name" />
            </div> */}

            <div className="flex mb-4">
              <input
                className="pl-2 mt-1 px-3 py-2 bg-gray-50 border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-blue-500 block w-full rounded-md sm:text-sm focus:ring-1"
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
              />
            </div>

            <div className="flex">
              <input
                className="pl-2 mt-1 px-3 py-2 bg-gray-50 border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-blue-500 block w-full rounded-md sm:text-sm focus:ring-1"
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <p className="text-white bg-red-500 rounded-md pl-2 mt-2 bg-opacity-90">{msg}</p>
            <button
              type="submit"
              className="block w-full bg-blue-600 mt-4 py-2 rounded-md text-white font-semibold mb-2"
            >
              Login
            </button>
            {/* <a href="/">Login</a> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
