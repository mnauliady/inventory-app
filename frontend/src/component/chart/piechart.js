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
    console.log(data);
    setDataPie(data);
  };

  const labels = dataPie && dataPie.dataTotal && dataPie.dataTotal.map((data) => data.name);
  const total = dataPie && dataPie.dataTotal && dataPie.dataTotal.map((data) => data.total);

  const options = {
    // responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: false,
        text: "Chart.js Horizontal Bar Chart",
      },
    },
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgb(16, 185, 129, 0.5)",
        borderColor: "rgb(16, 185, 129)",
        data: total,
      },
    ],
  };

  return (
    <div className="h-72">
      <Pie options={options} data={data} width={100} height={50} />
    </div>
  );
};
export default PieChart;
