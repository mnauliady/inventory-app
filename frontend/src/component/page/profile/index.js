import React from "react";

//import hook useState from react
import { useState, useEffect } from "react";

//import axios
import axios from "axios";

//import hook history dari react router dom
import { useNavigate, Link, useParams } from "react-router-dom";

import { useSelector } from "react-redux";

import EditModal from "./editModal";

import AddAlert from "../../Alert/addAlert";
import EditAlert from "../../Alert/editAlert";
import DeleteAlert from "../../Alert/deleteAlert";

import ChangePasswordModal from "./changePassModal";

const Profile = () => {
  //state
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  // state untuk modal change password
  const [showModalChangePass, setShowModalChangePass] = useState(false);
  const [statusChangePass, setStatusChangePass] = useState("");

  // state untuk modal edit
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [statusEdit, setStatusEdit] = useState("");
  const [idUser, setIdUser] = useState();

  const navigate = useNavigate();

  //useEffect hook
  useEffect(() => {
    //panggil function "getPOstById"
    getProfileById();
  }, [statusEdit, statusChangePass]);

  //get ID from parameter URL
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  // validasi akses ke halaman, jika user tidak ditemukan
  useEffect(() => {
    if (user && user.id !== id) {
      navigate("/not-found");
    }
  }, [user, navigate]);

  //function "getProfileById"
  const getProfileById = async () => {
    try {
      //get data from server
      const response = await axios.get(`http://localhost:5000/users/${id}`);
      //get response data
      const data = await response.data;

      //assign data to state
      setName(data.name);
      setEmail(data.email);
      setMobile(data.mobile);
    } catch (error) {
      // jika id (tidak ditemukan maka akan redirect ke blank page)
      navigate("/not-found");
    }
  };

  const editProfile = (id) => {
    setIdUser(id);
    setShowModalEdit(true);
    setStatusEdit(false);
  };

  const changePassword = (id) => {
    setIdUser(id);
    setShowModalChangePass(true);
    setStatusChangePass(false);
  };

  return (
    <section className="w-full bg-gray-100 md:h-[calc(100vh-48px)]">
      <div id="main" className="main-content flex-1 bg-gray-100 pb-24 md:pb-5">
        <div className="bg-blue-800 p-4 shadow text-2xl text-white ">
          <h1 className="font-bold pl-2">Profile</h1>
        </div>
        {/* Modal Edit */}
        {showModalEdit && <EditModal id={idUser} setStatusEdit={setStatusEdit} setShowModalEdit={setShowModalEdit} />}
        {/* Modal Change Pass */}
        {showModalChangePass && (
          <ChangePasswordModal
            id={idUser}
            setStatusChangePass={setStatusChangePass}
            setShowModalChangePass={setShowModalChangePass}
          />
        )}

        {statusChangePass && (
          <EditAlert setStatusEdit={setStatusChangePass} message={`Change Password Successfully`}></EditAlert>
        )}

        <div className="flex flex-wrap mt-8 mx-8 mb-4">
          <div className="overflow-hidden bg-white shadow sm:rounded-lg w-1/2">
            <div className="px-4 py-5 sm:px-6 bg-gray-200">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Profile Information</h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="border-b-2 border-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{name}</dd>
                </div>
                <div className="border-b-2 border-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Mobile</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{mobile}</dd>
                </div>
                <div className="border-b-2 border-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{email}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        <Link
          onClick={() => {
            editProfile(id);
          }}
          className=" text-white bg-green-500 hover:bg-green-600 rounded-md font-medium text-sm px-5 py-2.5 ml-8"
        >
          Edit Profile
        </Link>
        <Link
          onClick={() => {
            changePassword(id);
          }}
          className=" text-white bg-amber-500 hover:bg-amber-600 rounded-md font-medium text-sm px-5 py-2.5 ml-2"
        >
          Change Password
        </Link>
      </div>
    </section>
  );
};

export default Profile;
