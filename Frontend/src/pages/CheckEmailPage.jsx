import React, { useState } from "react";
import { PiUserCircle } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const CheckEmailPage = () => {
  const [data, setData] = useState({ email: "" });
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/email`;

    try {
      const response = await axios.post(URL, data);
      toast.success(response.data.message);

      if (response.data.success) {
        setData({ email: "" });
        navigate("/password", {
          state: response?.data?.data,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f1fb] text-gray-800 dark:bg-[#0f172a] dark:text-gray-200 px-4">
      <div className="bg-[#fefcff] dark:bg-[#1e293b] w-full max-w-md p-8 rounded-2xl shadow-xl border border-[#e4dff4] dark:border-gray-600">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <PiUserCircle
            size={80}
            className="text-purple-500 dark:text-indigo-400"
          />
          <h2 className="text-3xl font-bold  dark:text-indigo-300">
            Welcome to ConvoSync
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please enter your email to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={data.email}
              onChange={handleOnChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#f3edf9] dark:bg-gray-700 text-gray-800 dark:text-white border border-[#d8c7f0] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-purple-400 hover:bg-purple-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded-lg transition duration-200"
          >
            Let&apos;s Go
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          New user?{" "}
          <Link
            to="/"
            className="text-purple-500 dark:text-indigo-400 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
