const express = require("express");
const { createServer } = require("http");
const { createServer: createHttpsServer } = require("https"); // Added
const { Server } = require("socket.io");
const cors = require("cors");
const fs = require("fs"); // For SSL certificates

const app = express();
app.use(cors());

// Create both HTTP and HTTPS servers
const httpServer = createServer(app);
const httpsServer = createHttpsServer({
  key: fs.readFileSync("key.pem"), // SSL key
  cert: fs.readFileSync("cert.pem") // SSL certificate
}, app);

// Socket.IO setup
const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Attach to both servers
io.attach(httpServer);
io.attach(httpsServer);

// Store scanned codes
const scannedCodes = [];

io.on("connection", (socket) => {
  console.log("Client connected via", socket.conn.secure ? "HTTPS" : "HTTP");

  // Existing event handlers...
  socket.on("register-display", () => {
    socket.emit("initial-codes", scannedCodes);
  });

  socket.on("scan", (code) => {
    scannedCodes.unshift(code);
    io.emit("scanned-code", code);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start both servers
const HTTP_PORT = 3001;
const HTTPS_PORT = 3002;

httpServer.listen(HTTP_PORT, "0.0.0.0", () => {
  console.log(`HTTP server running on http://localhost:${HTTP_PORT}`);
});

httpsServer.listen(HTTPS_PORT, "0.0.0.0", () => {
  console.log(`HTTPS server running on https://localhost:${HTTPS_PORT}`);
});