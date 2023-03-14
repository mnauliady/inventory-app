import React from "react";
import { NavLink } from "react-router-dom";

import { useSelector } from "react-redux";

const Sidebar = () => {
  // ambil data isError untuk pengecekan status ambil data user, dan var user untuk data user login
  const { user } = useSelector((state) => state.auth);

  return (
    <nav aria-label="alternative nav">
      <div className="bg-gray-800 shadow-xl h-20 fixed bottom-0 mt-12 md:relative md:h-screen z-10 w-full md:w-48 content-center">
        <div className="md:mt-12 md:w-48 md:fixed md:left-0 md:top-0 content-center md:content-start text-left justify-between">
          <ul className="list-reset flex flex-row md:flex-col pt-3 md:py-3 px-1 md:px-2 text-center md:text-left">
            {/* dashboard / home / / */}
            <li className="mr-3 flex-1">
              <NavLink
                className={(navData) =>
                  navData.isActive
                    ? "active block py-1 md:py-3 pl-1 align-middle text-blue-600 border-b-2 border-blue-600"
                    : "block py-1 md:py-3 pl-1 align-middle text-gray-300 no-underline border-b-2 border-gray-800 hover:border-blue-800"
                }
                to="/"
              >
                <i className="fa-solid fa-chart-line pr-0 md:pr-3"></i>
                <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">
                  Dashboard
                </span>
              </NavLink>
            </li>

            {/* category */}
            <li className="mr-3 flex-1">
              <NavLink
                className={(navData) =>
                  navData.isActive
                    ? "active block py-1 md:py-3 pl-1 align-middle text-blue-600 border-b-2 border-blue-600"
                    : "block py-1 md:py-3 pl-1 align-middle text-gray-300 no-underline border-b-2 border-gray-800 hover:border-blue-800"
                }
                to="/category"
              >
                <i className="fa-solid fa-list pr-0 md:pr-3"></i>
                <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">
                  Category
                </span>
              </NavLink>
            </li>

            {/* product */}
            <li className="mr-3 flex-1">
              <NavLink
                className={(navData) =>
                  navData.isActive
                    ? "active block py-1 md:py-3 pl-1 align-middle text-blue-600 border-b-2 border-blue-600"
                    : "block py-1 md:py-3 pl-1 align-middle text-gray-300 no-underline border-b-2 border-gray-800 hover:border-blue-800"
                }
                to="/products"
              >
                <i className="fa-solid fa-box-archive pr-0 md:pr-3"></i>
                <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">
                  Product
                </span>
              </NavLink>
            </li>

            {/* transaction */}
            <li className="mr-3 flex-1">
              <NavLink
                className={(navData) =>
                  navData.isActive
                    ? "active block py-1 md:py-3 pl-1 align-middle text-blue-600 border-b-2 border-blue-600"
                    : "block py-1 md:py-3 pl-1 align-middle text-gray-300 no-underline border-b-2 border-gray-800 hover:border-blue-800"
                }
                to="/transaction"
              >
                <i className="fa-solid fa-file-invoice-dollar pr-0 md:pr-3"></i>
                <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">
                  Transaction
                </span>
              </NavLink>
            </li>

            {/* customer */}
            <li className="mr-3 flex-1">
              <NavLink
                className={(navData) =>
                  navData.isActive
                    ? "active block py-1 md:py-3 pl-1 align-middle text-blue-600 border-b-2 border-blue-600"
                    : "block py-1 md:py-3 pl-1 align-middle text-gray-300 no-underline border-b-2 border-gray-800 hover:border-blue-800"
                }
                to="/customer"
              >
                <i className="fa-solid fa-users pr-0 md:pr-3 "></i>
                <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">
                  Customer
                </span>
              </NavLink>
            </li>

            {/* supplier */}
            <li className="mr-3 flex-1">
              <NavLink
                className={(navData) =>
                  navData.isActive
                    ? "active block py-1 md:py-3 pl-1 align-middle text-blue-600 border-b-2 border-blue-600"
                    : "block py-1 md:py-3 pl-1 align-middle text-gray-300 no-underline border-b-2 border-gray-800 hover:border-blue-800"
                }
                to="/supplier"
              >
                <i className="fa-solid fa-boxes-packing pr-0 md:pr-3"></i>
                <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">
                  Supplier
                </span>
              </NavLink>
            </li>

            {/* report */}
            <li className="mr-3 flex-1">
              <NavLink
                className={(navData) =>
                  navData.isActive
                    ? "active block py-1 md:py-3 pl-1 align-middle text-blue-600 border-b-2 border-blue-600"
                    : "block py-1 md:py-3 pl-1 align-middle text-gray-300 no-underline border-b-2 border-gray-800 hover:border-blue-800"
                }
                to="/report"
              >
                <i className="fa-solid fa-file-arrow-down pr-0 md:pr-3"></i>
                <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">
                  Report
                </span>
              </NavLink>
            </li>

            {user && user.role === "super admin" && (
              <div>
                {/* User */}
                <li className="mr-3 flex-1">
                  <NavLink
                    className={({ isActive }) =>
                      [
                        "block py-1 md:py-3 pl-1 align-middle text-gray-300 no-underline border-b-2 border-gray-800 hover:border-blue-800 ",
                        isActive ? "text-blue-600 border-b-2 border-blue-600" : null,
                      ]
                        .filter(Boolean)
                        .join(" ")
                    }
                    to="/user"
                  >
                    <i className="fa-solid fa-user pr-0 md:pr-3"></i>
                    <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">
                      User Management
                    </span>
                  </NavLink>
                </li>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
