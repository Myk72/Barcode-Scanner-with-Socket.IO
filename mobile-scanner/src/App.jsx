import { useState, useRef } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { io } from "socket.io-client";

function MobileScanner() {
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState("");
  const [ip_address, set_ip_address] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const socketRef = useRef(null);

  const connectToServer = () => {
    if (!ip_address) return;
    
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setConnectionStatus("Disconnected");
    }
    console.log(`https://${ip_address}:3002`)
    const newSocket = io(`https://${ip_address}:3002`, {
      secure: true,
      rejectUnauthorized: false, // Only for self-signed certs in development
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    // const newSocket = io(`http://${serverIp}:3002`, {
    // });

    newSocket.on("connect", () => {
      setConnectionStatus("Connected");
      socketRef.current = newSocket;
      console.log("Connected to server", socketRef.current?.id);
    });

    newSocket.on("disconnect", () => {
      setConnectionStatus("Disconnected");
      socketRef.current = null;
    });

    newSocket.on("connect_error", (err) => {
      setConnectionStatus(`Er: ${err.message}`);
      socketRef.current = null;
    });
  };

  const handleScan = (result) => {
    if (result && socketRef.current) {
      console.log("Sending scan:", result.text);
      socketRef.current.emit("scan", result.text);
      setLastScanned(result.text);
      setScanning(false);
    } else if (result) {
      console.warn("Scan received but no socket connection");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Mobile Barcode Scanner</h1>
      <p>Status: {connectionStatus}</p>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={ip_address}
          onChange={(e) => set_ip_address(e.target.value)}
          placeholder="Enter PC IP (e.g., 192.168.1.100)"
          style={{ padding: "10px", width: "100%" }}
        />
        <button
          onClick={connectToServer}
          style={{ padding: "10px", marginTop: "10px", width: "100%" }}
          disabled={!ip_address}
        >
          {connectionStatus === "Connected" ? "Reconnect" : "Connect to Server"}
        </button>
      </div>

      {connectionStatus === "Connected" && (
        <>
          <button
            onClick={() => setScanning(!scanning)}
            style={{ padding: "15px", width: "100%" }}
          >
            {scanning ? "Stop Scanning" : "Start Scanning"}
          </button>

          {scanning && (
            <div style={{ marginTop: "20px" }}>
              <BarcodeScannerComponent
                width="100%"
                height="300px"
                onUpdate={(err, result) => {
                  if (result) handleScan(result);
                  if (err) console.error(err);
                }}
              />
            </div>
          )}
        </>
      )}

      {lastScanned && (
        <div style={{ marginTop: "20px" }}>
          <h3>Last Scanned:</h3>
          <p>{lastScanned}</p>
        </div>
      )}
    </div>
  );
}
export default MobileScanner;
