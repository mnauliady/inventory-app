import React from "react";

import { Line } from "react-chartjs-2";

//import hook useState dan useEffect from react
import { useState, useEffect } from "react";
//import axios
import axios from "axios";

import moment from "moment/moment";

const LineChart = () => {
  const [dataLine, setDataLine] = useState([]);

  useEffect(() => {
    //panggil method "fetchData"
    fectData();
  }, []);

  //function "fetchData"
  const fectData = async () => {
    //fetching
    const response = await axios.get("http://localhost:5000/line");
    //get response data
    const data = await response.data;
    //assign response data to state "products"
    setDataLine(data);
  };

  const labelIn = dataLine && dataLine.dataIn && dataLine.dataIn.map((data) => `${data.month}`);
  const labelOut = dataLine && dataLine.dataOut && dataLine.dataOut.map((data) => `${data.month}`);

  let labels;
  if (labelIn > labelOut) {
    labels = labelIn;
  } else {
    labels = labelOut;
  }

  const incoming = dataLine && dataLine.dataIn && dataLine.dataIn.map((data) => data.total);

  const outgoing = dataLine && dataLine.dataOut && dataLine.dataOut.map((data) => data.total);

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
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Incoming",
        backgroundColor: "rgb(59, 130, 246)",
        borderColor: "rgb(59, 130, 246, 0.5)",
        data: incoming,
      },
      {
        label: "Outgoing",
        backgroundColor: "rgb(244, 63, 94)",
        borderColor: "rgb(244, 63, 94, 0.5)",
        data: outgoing,
      },
    ],
  };

  return (
    <div className="w-full h-72">
      <Line options={options} data={data} />
    </div>
  );
};

export default LineChart;
