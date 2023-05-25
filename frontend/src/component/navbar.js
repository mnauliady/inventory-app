import React, { Fragment, useState, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { getMe, LogOut, reset } from "../features/authSlice";
import logo from "../asset/img/logo.png";

const Navbar = () => {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ambil data isError untuk pengecekan status ambil data user, dan var user untuk data user login
  const { isError, user } = useSelector((state) => state.auth);

  // pengambilan data user pertama kali
  useEffect(() => {
    // ambil data user
    dispatch(getMe());
  }, [dispatch]);

  // validasi akses ke dashboard, jika user tidak ditemukan
  useEffect(() => {
    // jika error, maka arahkan ke halaman utama
    if (isError) {
      navigate("/login");
    }
  }, [isError, navigate]);

  const Logout = async () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/login");
  };

  return (
    <>
      <nav>
        <Disclosure as="nav" className="bg-gray-800 sticky top-0 z-50 block">
          {({ open }) => (
            <>
              <div className="ml-2 max-w-7xl px-2 sm:px-6 lg:px-0">
                <div className="relative flex h-12 items-center justify-between">
                  <div className="absolute left-0 flex items-center sm:hidden"></div>
                  <div className="flex flex-1 items-center sm:items-stretch justify-start">
                    <div className="flex flex-shrink-0 items-center">
                      {/* <img className="block h-7 w-auto lg:hidden" src={logo} alt="Your Company" />
                  <img className="hidden h-7 w-auto lg:block" src={logo} alt="Your Company" /> */}
                      <span className="text-xl font-semibold text-gray-300 ml-2">INVENTORY APP</span>
                    </div>
                    {/* <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div> */}
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    {/* <button
                  type="button"
                  className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button> */}

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none ">
                          <div className="text-gray-300 text-sm font-medium">Hi, {user && user.name}</div>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            <Link
                              className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                              to={`/profile/${user && user.id}`}
                            >
                              Profile Setting
                            </Link>
                          </Menu.Item>
                          <Menu.Item>
                            <button
                              onClick={Logout}
                              className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            >
                              Log Out
                            </button>
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>
            </>
          )}
        </Disclosure>
      </nav>
    </>
  );
};

export default Navbar;
