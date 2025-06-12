// src/socket.js
import io from "socket.io-client";

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_BACKEND_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  return socket;
};

export const getSocket = () => socket;
