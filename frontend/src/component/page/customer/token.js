// import React from "react";
// //import hook useState dan useEffect from react
// import { useState, useEffect } from "react";
// import jwtDecode from "jwt-decode";
// //import axios
// import axios from "axios";

// const tokens = () => {
//   // token access for header Authorization
//   const [token, setToken] = useState("");
//   // token expire
//   const [expire, setExpire] = useState("");

//   (async () => {
//     try {
//       // ambil token user
//       const response = await axios.get("http://localhost:5000/token", {
//         withCredentials: true,
//       });

//       setToken(response.data.accessToken);
//       // decode dari token yang sudah diambil
//       const decoded = jwtDecode(response.data.accessToken);
//       // set expire token
//       setExpire(decoded.exp);
//     } catch (error) {
//       if (error.response) {
//         navigate("/");
//       }
//     }
//   })();

//   const axiosJWT = axios.create();

//   axiosJWT.interceptors.request.use(
//     async (config) => {
//       const currentDate = new Date();
//       if (expire * 1000 < currentDate.getTime()) {
//         const response = await axios.get("http://localhost:5000/token", { withCredentials: true });
//         config.headers.Authorization = `Bearer ${response.data.accessToken}`;

//         setToken(response.data.accessToken);
//         const decoded = jwtDecode(response.data.accessToken);

//         setExpire(decoded.exp);
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );
// };

// export default tokens;
