import React from "react";

const Forbidden = () => {
  return (
    <section className="w-full bg-gray-100 md:h-[calc(100vh-48px)]">
      <div id="main" className="main-content flex-1 bg-gray-100 pb-24 md:pb-5">
        <div className="bg-gray-800 pt-3">
          <div className=" bg-blue-800 p-4 shadow text-2xl text-white"></div>
        </div>

        <div className="flex flex-wrap">
          <h2 className="font-bold text-7xl text-gray-800 w-full text-center mt-5">403</h2>
          <h2 className="font-bold text-5xl text-gray-600 w-full text-center mt-5">Forbidden</h2>
          <h2 className="font-bold text-2xl text-gray-600 w-full text-center mt-5">
            You don't have access to this resource
          </h2>
        </div>
      </div>
    </section>
  );
};

export default Forbidden;
