// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Ensure Font Awesome is imported
import "./App.css";

function App() {
  const [currencyPair, setCurrencyPair] = useState("");
  const [status, setStatus] = useState("Stopped");
  const [id, setID] = useState("");
  useEffect(() => {
    const run = async () => {
      if (
        window.Telegram &&
        window.Telegram.WebApp &&
        window.Telegram.WebApp.initData
      ) {
        const params = new URLSearchParams(window.Telegram.WebApp.initData);
        const user = JSON.parse(decodeURIComponent(params.get("user")));
        setID(user.id);
      }
    };
    run();
  }, []);

  const handleStartMonitoring = async () => {
    if (!currencyPair) {
      alert("Please enter a currency pair!");
      return;
    }
    setStatus("Monitoring...");
    await axios.post(
      "https://candle-sentinel-server.vercel.app/api/start-monitoring",
      {
        currencyPair,
        id,
      }
    );
  };

  const handleStopMonitoring = async () => {
    setStatus("Stopped");
    await axios.post(
      "https://candle-sentinel-server.vercel.app/api/stop-monitoring"
    );
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">
        <i className="fas fa-wallet"></i> Telegram Bot Currency Monitor
      </h1>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={currencyPair}
              onChange={(e) => setCurrencyPair(e.target.value)}
              placeholder="Enter currency pair (e.g., EUR/USD)"
            />
            <div className="input-group-append">
              <button
                className="btn btn-primary"
                onClick={handleStartMonitoring}
              >
                <i className="fas fa-play"></i> Start Monitoring
              </button>
            </div>
          </div>
          <button
            className="btn btn-danger btn-block mb-3"
            onClick={handleStopMonitoring}
          >
            <i className="fas fa-stop"></i> Stop Monitoring
          </button>
          <div className="alert alert-info text-center">
            <i className="fas fa-info-circle"></i> Status: {status}
          </div>
        </div>
      </div>
      <footer className="text-center mt-4">
        <p>&copy; {new Date().getFullYear()} Golden Team</p>
      </footer>
    </div>
  );
}

export default App;
