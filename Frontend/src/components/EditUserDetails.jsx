// src/components/EditUserDetails.jsx
import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import uploadFile from "../helpers/uploadFile";
import Divider from "./Divider";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user?.name || "",
    profile_pic: user?.profile_pic || "",
  });
  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      name: user?.name || "",
      profile_pic: user?.profile_pic || "",
    }));
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadPhotoRef.current.click();
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);

    setData((prev) => ({
      ...prev,
      profile_pic: uploadPhoto?.url,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/update-user`;
      const token = localStorage.getItem("token");

      const payload = {
        name: data.name,
        profile_pic: data.profile_pic,
      };

      const response = await axios.post(URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      toast.success(response?.data?.message);

      if (response.data.success && response.data.data) {
        dispatch(setUser(response.data.data));
        setTimeout(() => onClose(), 50);
      } else {
        toast.error("Invalid user data returned");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
      <div className="w-full max-w-md bg-[#f9f3ff] dark:bg-[#1e293b] rounded-2xl shadow-lg p-6 mx-3">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#6b4b9e] dark:text-white">
            Edit Profile
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Update your details below
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1 dark:text-slate-200"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={data.name}
              onChange={handleOnChange}
              className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#c1a2ff] dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-slate-200">
              Profile Photo
            </label>
            <div className="flex items-center gap-4">
              <Avatar
                width={48}
                height={48}
                imageUrl={data?.profile_pic}
                name={data?.name}
              />
              <div>
                <label htmlFor="profile_pic">
                  <button
                    type="button"
                    onClick={handleOpenUploadPhoto}
                    className="text-sm font-semibold text-[#6b4b9e] hover:underline dark:text-purple-300"
                  >
                    Change Photo
                  </button>
                  <input
                    type="file"
                    id="profile_pic"
                    className="hidden"
                    onChange={handleUploadPhoto}
                    ref={uploadPhotoRef}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Divider */}
          <Divider />

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-[#6b4b9e] text-[#6b4b9e] hover:bg-[#6b4b9e] hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-[#6b4b9e] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#6b4b9e] text-white hover:bg-[#583a8c] transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EditUserDetails);
