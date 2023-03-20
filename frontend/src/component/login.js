import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset } from "../features/authSlice";

import loginImage from "../asset/img/login.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user || isSuccess) {
      navigate("/");
    }
    dispatch(reset());
  }, [user, isSuccess, dispatch, navigate]);

  const Auth = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ email, password }));
  };

  return (
    <div className="bg-gray-800 w-full">
      <div className="w-1/2 m-auto py-36 md:flex">
        <div className="relative oferflow-hidden md:flex w-1/2 rounded-l-lg bg-blue-400 py-6 hidden ">
          <img src={loginImage} alt="login" />
        </div>
        <div className="flex md:w-1/2 justify-center py-10 items-center bg-gray-700 rounded-lg md:rounded-r-lg md:rounded-l-none ">
          <form onSubmit={Auth}>
            <h1 className="font-bold text-2xl mb-1 text-gray-50">Welcome Back</h1>
            <p className="text-sm font-normal text-gray-200 mb-4">Login to your account</p>
            <div className="flex mb-4">
              <input
                className="text-gray-50 pl-2 mt-1 px-3 py-2 bg-gray-600 shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-gray-100 block w-full rounded-md sm:text-sm focus:ring-1"
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
                className="text-gray-50 pl-2 mt-1 px-3 py-2 bg-gray-600 shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-gray-200 block w-full rounded-md sm:text-sm focus:ring-1"
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            {/* <p className="text-white bg-red-500 rounded-md pl-2 mt-2 bg-opacity-90">{msg}</p> */}
            {isError && <p className="text-white bg-red-500 rounded-md pl-2 mt-2 bg-opacity-90">{message}</p>}
            <button
              type="submit"
              className="block w-full bg-blue-600 mt-4 py-2 rounded-md text-white font-semibold mb-2"
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
            {/* <a href="/">Login</a> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
