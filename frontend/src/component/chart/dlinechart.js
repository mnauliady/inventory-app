import React from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";

//import hook useState dan useEffect from react
import { useState, useEffect } from "react";
//import axios
import axios from "axios";

const DoubleBarChart = () => {
  const [dataBar, setDataBar] = useState([]);

  useEffect(() => {
    //panggil method "fetchData"
    fectData();
  }, []);

  //function "fetchData"
  const fectData = async () => {
    //fetching
    const response = await axios.get("http://localhost:5000/bar2");
    //get response data
    const data = await response.data;
    console.log(data);
    //assign response data to state "products"
    setDataBar(data);
  };

  // const labels = dataBar && dataBar.dataTotal && dataBar.dataTotal.map((data) => data.name);
  const dataIn = dataBar && dataBar.dataIn && dataBar.dataIn.map((data) => data.total);
  const dataOut = dataBar && dataBar.dataOut && dataBar.dataOut.map((data) => Math.abs(data.total));
  const labels = dataBar && dataBar.product && dataBar.product.map((data) => data.name);
  console.log(labels);

  const options = {
    // responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Incoming Purchase",
        data: dataIn,
        backgroundColor: "rgb(59, 130, 246, 0.5)",
        // borderColor: "rgb(59, 130, 246, 0.5)",
      },
      {
        label: "Outgoing Orders",
        data: dataOut,
        backgroundColor: "rgb(244, 63, 94, 0.5)",
        // borderColor: "rgb(244, 63, 94, 0.5)",
      },
    ],
  };

  return (
    <div className="w-full h-96">
      <Bar options={options} data={data} />
    </div>
  );
};
export default DoubleBarChart;
