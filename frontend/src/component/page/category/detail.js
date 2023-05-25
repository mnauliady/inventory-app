import React from "react";

//import hook useState from react
import { useState, useEffect } from "react";

//import axios
import axios from "axios";

//import hook history dari react router dom
import { useNavigate, Link, useParams } from "react-router-dom";

const DetailCategory = () => {
  //state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [product, setProduct] = useState([]);

  const navigate = useNavigate();

  //useEffect hook
  useEffect(() => {
    //panggil function "getPOstById"
    getCategoryById();
  }, []);

  //get ID from parameter URL
  const { id } = useParams();

  //function "getCategoryById"
  const getCategoryById = async () => {
    try {
      //get data from server
      const response = await axios.get(`http://localhost:5000/categories/${id}`);
      //get response data
      const data = await response.data;
      //assign data to state
      setName(data.name);
      setDescription(data.description);
      setProduct(data.product);
      console.log(data.product);
    } catch (error) {
      // jika id (tidak ditemukan maka akan redirect ke blank page)
      navigate("/not-found");
    }
  };

  return (
    <section className="w-full bg-gray-100 md:h-[calc(100vh-48px)]">
      <div id="main" className="main-content flex-1 bg-gray-100 pb-24 md:pb-5">
        <div className="bg-gray-800">
          <div className="bg-blue-800 p-4 shadow text-2xl text-white ">
            <h1 className="font-bold pl-2">Category</h1>
          </div>
        </div>

        <div className="flex flex-wrap mt-8 mx-8 mb-4">
          <div className="overflow-hidden bg-white shadow sm:rounded-lg w-full">
            <div className="px-4 py-5 sm:px-6 bg-gray-200">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Category Information</h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="border-b-2 border-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{name}</dd>
                </div>
                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{description}</dd>
                </div>
              </dl>
              {product.length ? (
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className=" text-sm text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        #
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Product SKU
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Product Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.map((p, index) => (
                      <tr
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                        key={p.id}
                      >
                        <td scope="row" className="px-6 py-4 whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/products/${p.id}`} className=" hover:text-blue-500 hover:font-semibold">
                            {p.sku}
                          </Link>
                        </td>
                        <td className="px-6 py-4">{p.name}</td>
                        <td className="px-6 py-4">Rp {p.price.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <Link
          // to="/category"
          onClick={() => navigate(-1)}
          className=" text-white bg-gray-500 hover:bg-gray-600 rounded-md font-medium text-sm px-5 py-2.5 ml-8"
        >
          Back
        </Link>
      </div>
    </section>
  );
};

export default DetailCategory;
