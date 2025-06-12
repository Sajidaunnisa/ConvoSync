import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../helpers/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });
  const [uploadPhoto, setUploadPhoto] = useState("");
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    const uploadPhoto = await uploadFile(file);
    console.log(uploadPhoto);

    setUploadPhoto(file);

    setData((preve) => {
      return {
        ...preve,
        profile_pic: uploadPhoto?.url,
      };
    });
  };
  const handleClearUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/register`;

    try {
      const response = await axios.post(URL, data);
      console.log("response", response);

      toast.success(response.data.message);

      if (response.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
        });

        navigate("/email");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    console.log("data", data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-lg overflow-hidden grid md:grid-cols-2 m-3">
        {/* Left Section (Optional Logo or Welcome Text) */}
        <div className="hidden md:flex flex-col justify-center items-center bg-primary text-white px-6 py-10">
          <h2 className="text-3xl font-bold mb-4">Join ConvoSync</h2>
          <p className="text-center text-lg">
            Start your journey with us. Collaborate, chat, and connect
            instantly.
          </p>
          {/* You can replace below with a logo or image if preferred */}
        </div>

        {/* Right Section - Form */}
        <div className="p-8 sm:p-10">
          <h3 className="text-center text-2xl font-semibold text-primary">
            Create Account
          </h3>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                className="w-full border rounded px-3 py-2 bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                value={data.name}
                onChange={handleOnChange}
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="john@example.com"
                className="w-full border rounded px-3 py-2 bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                value={data.email}
                onChange={handleOnChange}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="********"
                className="w-full border rounded px-3 py-2 bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                value={data.password}
                onChange={handleOnChange}
                required
              />
            </div>

            {/* Profile Picture Upload */}
            <div>
              <label htmlFor="profile_pic" className="block font-medium mb-1">
                Profile Photo
              </label>
              <label
                htmlFor="profile_pic"
                className="flex items-center justify-between bg-slate-200 border rounded px-3 py-2 cursor-pointer hover:border-primary"
              >
                <span className="truncate text-sm">
                  {uploadPhoto?.name || "Upload your Profile pic"}
                </span>
                {uploadPhoto?.name && (
                  <button
                    type="button"
                    onClick={handleClearUploadPhoto}
                    className="text-red-600 hover:text-red-800 text-xl"
                  >
                    <IoClose />
                  </button>
                )}
              </label>
              <input
                type="file"
                id="profile_pic"
                name="profile_pic"
                className="hidden"
                onChange={handleUploadPhoto}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg text-lg font-semibold hover:bg-secondary transition-colors"
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/email"
              className="text-primary font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
