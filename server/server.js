import express from "express";
import { createServer } from "http";
import { createServer as createHttpsServer } from "https";
import cors from "cors";
import fs from "fs";
import { Server } from "socket.io";

const app = express();
app.use(cors());

const httpServer = createServer(app);
const httpsServer = createHttpsServer(
  {
    key: fs.readFileSync("../key.pem"),
    cert: fs.readFileSync("../cert.pem"),
  },
  app
);

const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let scannedCodes = [];

io.attach(httpServer);
io.attach(httpsServer);

io.on("connection", (socket) => {
  console.log(
    socket.handshake.headers.host.endsWith("3001")
      ? "HTTP (PC)"
      : "HTTPS (Mobile)"
  );

  socket.on("register-display", () => {
    socket.emit("initial-codes", scannedCodes);
  });

  socket.on("scan", (code) => {
    scannedCodes = [code, ...scannedCodes];
    io.emit("scanned-code", code);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const HTTP_PORT = 3001;
const HTTPS_PORT = 3002;

httpServer.listen(HTTP_PORT, "0.0.0.0", () => {
  console.log(`HTTP server running on http://localhost:${HTTP_PORT}`);
});

httpsServer.listen(HTTPS_PORT, "0.0.0.0", () => {
  console.log(`HTTPS server running on https://localhost:${HTTPS_PORT}`);
});
