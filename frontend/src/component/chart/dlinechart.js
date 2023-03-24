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
  const dataset1Data = dataBar && dataBar.dataIn && dataBar.dataIn.map((data) => data.total);
  const dataset2Data = dataBar && dataBar.dataOut && dataBar.dataOut.map((data) => Math.abs(data.total));
  const dataset1Labels = dataBar && dataBar.dataIn && dataBar.dataIn.map((data) => data.name);
  const dataset2Labels = dataBar && dataBar.dataOut && dataBar.dataOut.map((data) => data.name);

  const allLabels = [...dataset1Labels, ...dataset2Labels];

  const allData = allLabels.map((label) => {
    const dataset1Index = dataset1Labels.indexOf(label);
    const dataset1Value = dataset1Index !== -1 ? dataset1Data[dataset1Index] : 0;
    const dataset2Index = dataset2Labels.indexOf(label);
    const dataset2Value = dataset2Index !== -1 ? dataset2Data[dataset2Index] : 0;
    return [dataset1Value, dataset2Value];
  });

  // const dataset1Labels = ["January", "February", "March", "April", "May"];
  // const dataset1Data = [10, 20, 30, 40, 50];
  // const dataset2Labels = ["February", "April", "May"];
  // const dataset2Data = [15, 25, 35];
  // const allLabels = [...new Set([...dataset1Labels, ...dataset2Labels])];

  // const allData = allLabels.map((label) => {
  //   const dataset1Index = dataset1Labels.indexOf(label);
  //   const dataset1Value = dataset1Index !== -1 ? dataset1Data[dataset1Index] : 0;
  //   const dataset2Index = dataset2Labels.indexOf(label);
  //   const dataset2Value = dataset2Index !== -1 ? dataset2Data[dataset2Index] : 0;
  //   return [dataset1Value, dataset2Value];
  // });
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

  const data = {
    labels: allLabels,
    datasets: [
      {
        label: "Incoming",
        data: allData.map((data) => data[0]),
        backgroundColor: "rgb(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246 )",
      },
      {
        label: "Outgoing",
        data: allData.map((data) => data[1]),
        backgroundColor: "rgb(244, 63, 94, 0.5)",
        borderColor: "rgb(244, 63, 94)",
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
