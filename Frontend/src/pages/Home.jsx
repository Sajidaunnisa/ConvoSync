import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  logout,
  setOnlineUser,
  setSocketConnection,
  setUser,
} from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import logo from "../assets/logo.png";
import { connectSocket, getSocket } from "../socket";

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserAndConnectSocket = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user-details`,
          {
            headers: {
              Authorization: token,
            },
            withCredentials: true,
          }
        );

        if (!response.data.data || response.data.logout) {
          dispatch(logout());
          navigate("/email");
          return;
        }

        dispatch(setUser(response.data.data));

        const socketConnection = connectSocket();
        dispatch(setSocketConnection(socketConnection));

        socketConnection.on("onlineUser", (data) => {
          dispatch(setOnlineUser(data));
        });
      } catch (error) {
        console.error("❌ Error fetching user or connecting socket:", error);
      }
    };

    fetchUserAndConnectSocket();

    return () => {
      const socket = getSocket();
      if (socket) socket.disconnect();
    };
  }, []);

  const basePath = location.pathname === "/message";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] h-screen bg-[#f8f4ff] dark:bg-[#0f172a] transition-colors duration-300">
      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-[#1e293b] border-r border-gray-200 dark:border-gray-700 ${
          !basePath && "hidden"
        } lg:block`}
      >
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="relative flex flex-col overflow-hidden">
        <section className={`${basePath && "hidden"} h-full`}>
          <Outlet />
        </section>

        {/* When no user is selected */}
        {basePath && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="bg-white dark:bg-[#516fa1] p-6 rounded-2xl shadow-lg max-w-sm w-full border border-[#c8a5ec] dark:border-gray-700">
              <img src={logo} alt="logo" className="w-48 mx-auto mb-4" />
              <p className="text-lg text-purple-600 dark:text-indigo-300 font-medium">
                Select a user to start chatting 🎯
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
