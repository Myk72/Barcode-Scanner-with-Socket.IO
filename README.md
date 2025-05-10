# Real Time Barcode Scanner System Using Socket.IO Client

## Components

### 1. PC Display (React)
- Location: `frontend/`
- Runs on: `http://localhost:5173`
- Displays scanned barcodes in real time
- Connects to backend via Socket.IO client

### 2. Mobile Scanner (React)
- Location: `mobile-scanner/` 
- get ip in cmd: `ipconfig`
- Runs on: `https://[YOUR_LOCAL_IP]:5173`
- HTTPS interface for barcode input
- Requires network access to backend

### 3. Backend Server (Express/Socket.IO)
- Location: `server/`
- get ip in cmd: `ipconfig`
- HTTP: `http://[YOUR_LOCAL_IP]:3001`
- HTTPS: `https://[YOUR_LOCAL_IP]:3002`
- Handles all WebSocket connections
- Stores and broadcasts scanned codes

## 🛠️ Setup Instructions

### Prerequisites
- Node.js v16+
- All devices on same local network

### 1. Backend Setup
```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
cd server
npm install
npm start
```
### 2. Frontend Setup (PC Display)
```bash
cd frontend
npm install
npm run dev
```

### 2. Frontend Setup (Mobile Scanner)
```bash
cd mobile-scanner
npm install
npm run dev
```

## 🔒 HTTPS Security Notice
You'll see this warning when accessing: ⚠️Your connection is not private⚠️

**This is normal for local development.** To proceed:

### On Computers:

- **Chrome/Edge**:  
  Click "Advanced" → "Proceed to site"

- **Firefox**:  
  Click "Advanced" → "Accept Risk"

### On Mobile Devices:

1. First visit:  
   `https://[YOUR_LOCAL_IP]:3002`
2. Accept the security warning
3. Then access the scanner interface and Accept the security warning
4. Finally you can scan a barcode and see the output on your PC

> **Note**: Replace `[YOUR_LOCAL_IP]` with your actual local IP address (e.g., `192.168.1.100`).