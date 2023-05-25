import React, { useEffect } from "react";

const DeleteAlert = ({ setStatusDelete }) => {
  useEffect(() => {
    setTimeout(() => {
      document.getElementById("alert").classList.add("hidden");
      setStatusDelete(false);
    }, 3000);
  }, []);

  const dismissAlert = () => {
    document.getElementById("alert").classList.add("hidden");
    setStatusDelete(false);
  };

  return (
    <div className="fixed right-10 top-14 z-50 w-1/4">
      <div
        id="alert"
        className="shadow-xl bg-red-100 border border-red-400 text-red-700 px-4 py-4 rounded ml-2 mr-8 w-full"
        role="alert"
      >
        <strong className="font-bold">Data Successfully Deleted</strong>
        <button onClick={dismissAlert}>
          <span className="absolute top-0 bottom-0 right-0 pl-4 py-4">
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
