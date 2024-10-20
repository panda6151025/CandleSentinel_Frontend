// src/App.js
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [currencyPair, setCurrencyPair] = useState("");
  const [status, setStatus] = useState("Stopped");

  const handleStartMonitoring = async () => {
    setStatus("Monitoring...");
    await axios.post("/api/start-monitoring", { currencyPair });
  };

  const handleStopMonitoring = async () => {
    setStatus("Stopped");
    await axios.post("/api/stop-monitoring");
  };

  return (
    <div>
      <h1>Telegram Bot Currency Monitor</h1>
      <input
        type="text"
        value={currencyPair}
        onChange={(e) => setCurrencyPair(e.target.value)}
        placeholder="Enter currency pair (e.g., EURUSD)"
      />
      <button onClick={handleStartMonitoring}>Start Monitoring</button>
      <button onClick={handleStopMonitoring}>Stop Monitoring</button>
      <p>Status: {status}</p>
    </div>
  );
}

export default App;
