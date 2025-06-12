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
    <div className="min-h-screen flex items-center justify-center bg-dark-background text-dark-text px-4">
      <div className="bg-dark-surface w-full max-w-lg p-6 rounded-lg shadow-lg border border-dark-border">
        <div className="flex flex-col items-center gap-2 mb-6">
          <PiUserCircle size={80} className="text-dark-primary" />
          <h2 className="text-2xl font-bold text-dark-primary">
            Welcome to Chat App
          </h2>
          <p className="text-dark-muted text-sm">
            Please enter your email to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">
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
              className="w-full px-4 py-2 rounded bg-dark-background text-dark-text border border-dark-border focus:outline-none focus:ring-2 focus:ring-dark-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-primary hover:bg-secondary text-white font-semibold rounded transition duration-200"
          >
            Let&apos;s Go
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-dark-muted">
          New user?{" "}
          <Link
            to="/"
            className="text-dark-primary font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
