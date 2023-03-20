import React from "react";

const Blank = () => {
  return (
    <section className="w-full">
      <div id="main" className="main-content h-full flex-1 bg-gray-100 pb-24 md:pb-5">
        <div className="bg-gray-800 pt-3">
          <div className=" bg-blue-800 p-4 shadow text-2xl text-white"></div>
        </div>

        <div className="flex flex-wrap">
          <h2 className="font-bold text-7xl text-gray-800 w-full text-center mt-5">404</h2>
          <h2 className="font-bold text-5xl text-gray-600 w-full text-center mt-5">Page Not Found</h2>
          <h2 className="font-bold text-2xl text-gray-600 w-full text-center mt-5">Your requested page is not found</h2>
        </div>
      </div>
    </section>
  );
};

export default Blank;
