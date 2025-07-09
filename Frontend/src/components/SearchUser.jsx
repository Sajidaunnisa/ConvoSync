import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Loading from "./Loading";
import UserSearchCard from "./UserSearchCard";
import toast from "react-hot-toast";
import axios from "axios";
import { IoClose } from "react-icons/io5";

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearchUser = async () => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/search-user`;
    try {
      setLoading(true);
      const response = await axios.post(URL, {
        search: search,
      });
      setLoading(false);

      setSearchUser(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    handleSearchUser();
  }, [search]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl"
          aria-label="Close"
        >
          <IoClose />
        </button>

        {/* Search Input */}
        <div className="flex items-center border-b px-4 py-3 gap-2">
          <IoSearchOutline size={22} className="text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full outline-none text-base bg-transparent"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent flex-1">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-32">
              <Loading />
            </div>
          )}

          {/* No User Found */}
          {!loading && searchUser.length === 0 && (
            <p className="text-center text-slate-400">No user found!</p>
          )}

          {/* User List */}
          {!loading &&
            searchUser.length > 0 &&
            searchUser.map((user) => (
              <UserSearchCard key={user._id} user={user} onClose={onClose} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
