import React from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";

//import hook useState dan useEffect from react
import { useState, useEffect } from "react";
//import axios
import axios from "axios";

const BarChart = () => {
  const [dataBar, setDataBar] = useState([]);

  useEffect(() => {
    //panggil method "fetchData"
    fectData();
  }, []);

  //function "fetchData"
  const fectData = async () => {
    //fetching
    const response = await axios.get("http://localhost:5000/bar");
    //get response data
    const data = await response.data;
    //assign response data to state "products"
    setDataBar(data);
  };

  const labels = dataBar && dataBar.dataTotal && dataBar.dataTotal.map((data) => data.name);
  const total = dataBar && dataBar.dataTotal && dataBar.dataTotal.map((data) => data.total);

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          // forces step size to be 50 units
          stepSize: 1,
        },
      },
    },
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

  const data = {
    labels,
    datasets: [
      {
        label: "Total Product",
        data: total,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
    ],
  };

  return (
    <div className="w-full h-72">
      <Bar options={options} data={data} />
    </div>
  );
};

export default BarChart;
