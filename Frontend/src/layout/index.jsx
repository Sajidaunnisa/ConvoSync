import React from "react";
import logo from "../assets/logo.png";

const AuthLayouts = ({ children }) => {
  return (
    <>
      <header className="flex justify-center items-center py-4 h-24 shadow-md bg-[#f3eaff] dark:bg-[#1e293b] transition-all duration-300">
        <div className="flex flex-col items-center text-center mt-9">
          <img
            src={logo}
            alt="ConvoSync Logo"
            className="w-32 h-auto object-contain"
          />
          <p className="text-sm mt-1 text-[#6b4b9e] dark:text-slate-300 font-medium tracking-wide italic mb-3">
            Connect. Converse. ConvoSync.
          </p>
        </div>
      </header>

      {children}
    </>
  );
};

export default AuthLayouts;
