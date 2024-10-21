import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";
import dotenv from "dotenv";
function App() {
  const [currencyPair, setCurrencyPair] = useState("");
  const [status, setStatus] = useState("Stopped");
  const [id, setID] = useState("7523791216");
  dotenv.config();
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

    // // Directly call the API to fetch candle data and check patterns
    // const response = await axios.get(
    //   `https://api.yourdata.com/v1/candles/${currencyPair}/data`
    // );
    // const candles = response.data;
    // const sequences = checkPatterns(candles);

    // // Note: Implement a sendAlert function to communicate with Telegram API
    // if (sequences.length > 0) {
    await sendAlert(
      `Alert: Unique bullish sequence detected for ${currencyPair}`,
      id
    );
    // }
  };

  const handleStopMonitoring = () => {
    setStatus("Stopped");
  };

  const checkPatterns = (candles) => {
    const sequences = [];
    for (let i = 0; i < candles.length - 3; i++) {
      const currentSequence = candles.slice(i, i + 4);
      if (currentSequence.every((candle) => candle.type === "bullish")) {
        if (!threeCandlePatternExists(currentSequence)) {
          sequences.push(currentSequence);
        }
      }
    }
    return sequences;
  };

  const threeCandlePatternExists = (sequence) => {
    return (
      sequence[0].type === sequence[1].type &&
      sequence[1].type === sequence[2].type
    );
  };

  const sendAlert = async (message, id) => {
    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: id,
        text: message,
      }
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
