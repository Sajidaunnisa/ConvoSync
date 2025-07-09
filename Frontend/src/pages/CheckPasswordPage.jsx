import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/userSlice";

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
    userId: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location?.state?.name) {
      navigate("/email");
    }
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/password`;

    try {
      const response = await axios({
        method: "post",
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password,
        },
        withCredentials: true,
      });

      toast.success(response.data.message);

      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);

        setData({
          password: "",
        });
        navigate("/message");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-10 px-4">
      <div className="bg-[#fdf9ff] dark:bg-[#1e293b] w-full max-w-md rounded-2xl overflow-hidden shadow-xl p-6 mx-auto border border-[#e7d9f5] dark:border-gray-700">
        {/* Profile */}
        <div className="w-fit mx-auto mb-4 flex justify-center items-center flex-col">
          <Avatar
            width={70}
            height={70}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
          <h2 className="font-semibold text-xl mt-2 dark:text-indigo-300">
            {location?.state?.name}
          </h2>
        </div>

        {/* Form */}
        <form className="grid gap-5 mt-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 rounded-lg bg-[#f3edf9] dark:bg-gray-700 text-gray-800 dark:text-white border border-[#d8c7f0] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-lg font-semibold py-2 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="my-4 text-center text-sm font-medium dark:text-indigo-400 hover:underline cursor-pointer">
          Forgot password?
        </p>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
