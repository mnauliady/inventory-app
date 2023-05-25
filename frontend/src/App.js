// import logo from "./logo.svg";
// import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./component/navbar";
import Main from "./component/main";
import Login from "./component/login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Main />
            </>
          }
        ></Route>
      </Routes>
    </>
  );
}

export default App;
