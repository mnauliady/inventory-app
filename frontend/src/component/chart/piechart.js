import React from "react";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";
//import hook useState dan useEffect from react
import { useState, useEffect } from "react";
//import axios
import axios from "axios";

import moment from "moment/moment";

const PieChart = () => {
  const [dataPie, setDataPie] = useState([]);

  useEffect(() => {
    //panggil method "fetchData"
    fectData();
  }, []);

  //function "fetchData"
  const fectData = async () => {
    //fetching
    const response = await axios.get("http://localhost:5000/pie");
    //get response data
    const data = await response.data;
    //assign response data to state "products"
    setDataPie(data);
  };

  const supplier = dataPie && dataPie.supplier && dataPie.supplier[0].count;
  const customer = dataPie && dataPie.customer && dataPie.customer[0].count;
  // const total = dataPie && dataPie.dataTotal && dataPie.dataTotal.map((data) => data.total);

  const options = {
    // responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Chart.js Horizontal Bar Chart",
      },
    },
  };

  const data = {
    labels: ["Supplier", "Customer"],
    datasets: [
      {
        label: "Total",
        backgroundColor: ["rgb(34, 197, 94, 0.7)", "rgb(245, 158, 11, 0.7)"],
        // borderColor: "rgb(34, 197, 94)",
        data: [supplier, customer],
      },
    ],
  };

  return (
    <div className="h-72 w-full">
      <Pie options={options} data={data} width={100} height={50} />
    </div>
  );
};
export default PieChart;
