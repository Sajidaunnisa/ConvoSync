import React from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const UserSearchCard = ({ user, onClose }) => {
  return (
    <Link
      to={`/message/${user?._id}`}
      onClick={onClose}
      className="flex items-center gap-4 p-3 border-b border-slate-200 hover:bg-[#f4ecff] dark:hover:bg-[#1f2937] rounded transition-all duration-200"
    >
      {/* Avatar */}
      <Avatar
        width={48}
        height={48}
        name={user?.name}
        userId={user?._id}
        imageUrl={user?.profile_pic}
      />

      {/* User Info */}
      <div className="flex flex-col overflow-hidden">
        <p className="font-semibold text-base text-[#6b4b9e] dark:text-white truncate">
          {user?.name}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-300 truncate">
          {user?.email}
        </p>
      </div>
    </Link>
  );
};

export default UserSearchCard;
