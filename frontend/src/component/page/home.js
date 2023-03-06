import React from "react";
import LineChart from "../chart/linechart";
import BarChart from "../chart/barchart";
import PieChart from "../chart/piechart";

const Home = () => {
  return (
    <section>
      <div id="main" className="main-content flex-1 bg-gray-100 mt-12 md:mt-2 pb-24 md:pb-5">
        <div className="bg-gray-800 pt-3">
          <div className=" bg-blue-800 p-4 shadow text-2xl text-white">
            <h1 className="font-bold pl-2">Dashboard</h1>
          </div>
        </div>

        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 xl:w-1/3 p-6">
            {/* <!--Metric Card--> */}
            <div className=" bg-green-300 border-b-4 border-green-600 rounded-lg shadow-xl p-5">
              <div className="flex flex-row items-center">
                <div className="flex-shrink pr-4">
                  <div className="rounded-full p-5 bg-green-600">
                    <i className="fa fa-wallet fa-2x fa-inverse"></i>
                  </div>
                </div>
                <div className="flex-1 text-right md:text-center">
                  <h2 className="font-bold uppercase text-gray-600">Total Revenue</h2>
                  <p className="font-bold text-3xl">
                    $3249{" "}
                    <span className="text-green-500">
                      <i className="fas fa-caret-up"></i>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            {/* <!--/Metric Card--> */}
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 p-6">
            {/* <!--Metric Card--> */}
            <div className="bg-pink-200 border-b-4 border-pink-500 rounded-lg shadow-xl p-5">
              <div className="flex flex-row items-center">
                <div className="flex-shrink pr-4">
                  <div className="rounded-full p-5 bg-pink-600">
                    <i className="fas fa-users fa-2x fa-inverse"></i>
                  </div>
                </div>
                <div className="flex-1 text-right md:text-center">
                  <h2 className="font-bold uppercase text-gray-600">Total Users</h2>
                  <p className="font-bold text-3xl">
                    249{" "}
                    <span className="text-pink-500">
                      <i className="fas fa-exchange-alt"></i>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            {/* <!--/Metric Card--> */}
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 p-6">
            {/* <!--Metric Card--> */}
            <div className="bg-yellow-200 border-b-4 border-yellow-600 rounded-lg shadow-xl p-5">
              <div className="flex flex-row items-center">
                <div className="flex-shrink pr-4">
                  <div className="rounded-full p-5 bg-yellow-600">
                    <i className="fas fa-user-plus fa-2x fa-inverse"></i>
                  </div>
                </div>
                <div className="flex-1 text-right md:text-center">
                  <h2 className="font-bold uppercase text-gray-600">New Users</h2>
                  <p className="font-bold text-3xl">
                    2{" "}
                    <span className="text-yellow-600">
                      <i className="fas fa-caret-up"></i>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            {/* <!--/Metric Card--> */}
          </div>
        </div>

        <div className="flex flex-row flex-wrap flex-grow mt-2">
          <div className="w-full md:w-1/2 xl:w-1/3 p-6">
            {/* <!--Graph Card--> */}
            <div className="bg-white border-transparent rounded-lg shadow-xl">
              <div className="bg-gray-300 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2">
                <h className="font-bold uppercase text-gray-600">Graph</h>
              </div>
              <div className="p-5">
                {/* <canvas id="chartjs-7" className="chartjs" width="undefined" height="undefined"></canvas> */}
                <LineChart />
              </div>
            </div>
            {/* <!--/Graph Card--> */}
          </div>

          <div className="w-full md:w-1/2 xl:w-1/3 p-6">
            {/* <!--Graph Card--> */}
            <div className="bg-white border-transparent rounded-lg shadow-xl">
              <div className="bg-gray-300 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2">
                <h2 className="font-bold uppercase text-gray-600">Graph</h2>
              </div>
              <div className="p-5">
                {/* <canvas id="chartjs-0" className="chartjs" width="undefined" height="undefined"></canvas> */}
                <BarChart />
              </div>
            </div>
            {/* <!--/Graph Card--> */}
          </div>

          <div className="w-full md:w-1/2 xl:w-1/3 p-6">
            {/* <!--Graph Card--> */}
            <div className="bg-white border-transparent rounded-lg shadow-xl">
              <div className="bg-gray-300 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2">
                <h2 className="font-bold uppercase text-gray-600">Graph</h2>
              </div>
              <div className="p-5">
                {/* <canvas id="chartjs-1" className="chartjs" width="undefined" height="undefined"></canvas> */}
                <PieChart />
              </div>
            </div>
            {/* <!--/Graph Card--> */}
          </div>

          <div className="w-full p-6">
            {/* <!--Graph Card--> */}
            <div className="bg-white border-transparent rounded-lg shadow-xl">
              <div className="bg-gray-300 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2">
                <h2 className="font-bold uppercase text-gray-600">Table</h2>
              </div>
              <div className="p-5">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" class="px-6 py-3">
                        Product name
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Color
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Category
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class=" border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        Apple MacBook Pro 17"
                      </th>
                      <td class="px-6 py-4">Silver</td>
                      <td class="px-6 py-4">Laptop</td>
                      <td class="px-6 py-4">$2999</td>
                    </tr>
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        Microsoft Surface Pro
                      </th>
                      <td class="px-6 py-4">White</td>
                      <td class="px-6 py-4">Laptop PC</td>
                      <td class="px-6 py-4">$1999</td>
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        Magic Mouse 2
                      </th>
                      <td class="px-6 py-4">Black</td>
                      <td class="px-6 py-4">Accessories</td>
                      <td class="px-6 py-4">$99</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* <!--/Graph Card--> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
