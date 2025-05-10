import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const DisplayApp = () => {
  const [scannedCodes, setScannedCodes] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:3001", {
      reconnection: true,
      timeout: 5000,
    }); 
    // I have used port 3001 to communicate with the server

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("register-display");
    });

    socket.on("initial-codes", (codes) => {
      setScannedCodes(codes);
    });

    socket.on("scanned-code", (code) => {
      setScannedCodes((prev) => [code, ...prev]);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="flex p-10 items-center h-screen flex-col gap-4 font-serif">
      <h1 className="font-semibold">
        Barcode Display Test Using Socket.IO Client
      </h1>
      <div className="border p-5 border-gray-300 h-1/4 w-1/2 overflow-y-auto">
        {scannedCodes.length === 0 ? (
          <p className="text-center">No codes scanned yet</p>
        ) : (
          <ul>
            {scannedCodes.map((val, index) => (
              <li key={index} className="border-b border-gray-200 p-2">
                {val}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DisplayApp;
