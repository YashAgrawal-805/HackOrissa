// src/utils/socket.js
import { io } from "socket.io-client";

let socket = null;

export const initSocket = (token) => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      withCredentials: true,
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect error:", err.message);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) throw new Error("Socket not initialized. Call initSocket() first.");
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
