import { useState, useRef } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { io } from "socket.io-client";
import { Camera } from "lucide-react";

function MobileScanner() {
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState("");
  const [ip_address, set_ip_address] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Not connected");
  const socketRef = useRef(null);

  const connectToServer = () => {
    if (!ip_address) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setConnectionStatus("Not connected");
    }

    // console.log(`https://${ip_address}:3002`); hhttps server is working on 3002
    // why does it reject http

    const newSocket = io(`https://${ip_address}:3002`, {
      transports: ["websocket"],
      secure: true,
      rejectUnauthorized: false,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    newSocket.on("connect", () => {
      setConnectionStatus("Connected");
      socketRef.current = newSocket;
      // console.log("Now", socketRef.current?.id); debugging socket id
    });

    newSocket.on("disconnect", () => {
      setConnectionStatus("Not connected");
      socketRef.current = null;
    });

    newSocket.on("connect_error", (err) => {
      setConnectionStatus(`Er: ${err.message}`);
      socketRef.current = null;
    });
  };

  const handleScan = (result) => {
    if (result && socketRef.current) {
      // console.log("Sending scan:", result.text);
      socketRef.current.emit("scan", result.text);
      setLastScanned(result.text);
      setScanning(false);
    } else if (result) {
      console.warn("Scan received but no socket connection");
    }
  };

  return (
    <div className="flex items-center flex-col gap-4 font-serif p-10 h-screen">
      <h1 className="font-semibold text-2xl">Mobile Barcode Scanner</h1>

      <div className="space-y-3 p-5">
        <div className="space-y-2">
          <label className="font-medium">Enter IP Address:</label>

          <input
            type="text"
            value={ip_address}
            onChange={(e) => set_ip_address(e.target.value)}
            placeholder="e.g., 192.168.1.100"
            className="border border-gray-200 p-2 w-full rounded-lg"
          />
        </div>
        <div>
          <button
            onClick={connectToServer}
            className="border border-gray-400 bg-gray-300 p-2 rounded-xl w-full cursor-pointer"
            style={{
              backgroundColor: "#d4d4d4",
              marginTop: "10px",
            }}
            disabled={!ip_address}
          >
            {connectionStatus === "Connected"
              ? "Reconnect"
              : "Connect to Server"}
          </button>
        </div>
        <p
          className={`${
            connectionStatus === "Connected" ? "text-green-500" : "text-red-500"
          }`}
        >
          Status: {connectionStatus}
        </p>
        {connectionStatus === "Connected" && (
          <div className="flex justify-center items-center flex-col">
            <div
              className="flex flex-row gap-2 bg-gray-300 p-2 rounded-xl w-full cursor-pointer items-center justify-center"
              onClick={() => setScanning(!scanning)}
              style={{
                backgroundColor: "#d4d4d4",
                marginTop: "10px",
              }}
            >
              <button>{scanning ? "Stop Scanning" : "Start Scanning"}</button>
              <Camera className="size-6 " />
            </div>

            {scanning && (
              <div
                style={{ marginTop: "20px" }}
                className="flex justify-center w-3/4 items-center"
              >
                <BarcodeScannerComponent
                  width="100%"
                  onUpdate={(err, result) => {
                    if (result) handleScan(result);
                    if (err) console.error(err);
                  }}
                />
              </div>
            )}
          </div>
        )}
        {lastScanned && (
          <div style={{ marginTop: "20px" }}>
            <h3>Last Scanned:</h3>
            <p>{lastScanned}</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default MobileScanner;
