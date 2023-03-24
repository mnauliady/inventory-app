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
    //assign response data to state "products"
    setDataBar(data);
  };

  // const labels = dataBar && dataBar.dataTotal && dataBar.dataTotal.map((data) => data.name);
  const dataStock = dataBar && dataBar.data && dataBar.data.map((data) => data.total);
  const dataLow = dataBar && dataBar.data && dataBar.data.map((data) => data.min_stock);
  const labels = dataBar && dataBar.data && dataBar.data.map((data) => data.name);

  const options = {
    // responsive: true,
    maintainAspectRatio: false,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
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

  // console.log(dataStock);
  // const dataConvert = dataStock.map(Number);
  // console.log(dataConvert);
  let arr = [];
  if (dataStock) {
    arr = dataStock.map(Number);
  }

  console.log(arr);
  console.log(dataLow);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Total Stock",
        data: dataStock,
        backgroundColor: "rgb(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
      },
    ],
  };

  return (
    <div className="w-full h-96">
      {" "}
      <Bar options={options} data={data} />
    </div>
  );
};
export default DoubleBarChart;
