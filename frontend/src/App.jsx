import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    amount: "",
    session_duration: "",
    transaction_amount_vs_sender_history: "",
    transaction_time_of_day: "",
    input_timing_consistency: "",
    keyboard_input_speed: "",
    input_pause_patterns: "",
    screen_active_time: "",
    geographic_location_vs_ip: "",
    background_data_usage: "",
    pin_entry_speed: "",
    request_amount_roundness: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const numericData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          Number(value)
        ])
      );

      const response = await fetch(
        "http://localhost:8000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(numericData)
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      setResult(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      session_duration: "",
      transaction_amount_vs_sender_history: "",
      transaction_time_of_day: "",
      input_timing_consistency: "",
      keyboard_input_speed: "",
      input_pause_patterns: "",
      screen_active_time: "",
      geographic_location_vs_ip: "",
      background_data_usage: "",
      pin_entry_speed: "",
      request_amount_roundness: ""
    });

    setResult(null);
    setError("");
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">ML RISK ANALYSIS</p>
          <h1>UPI Fraud Detection</h1>
          <p className="subtitle">
            Experimental UPI-style transaction risk analysis
            powered by machine learning.
          </p>
        </div>
      </header>

      <main className="container">
        <section className="card">
          <div className="section-header">
            <div>
              <h2>Transaction Details</h2>
              <p>
                Enter the transaction characteristics below.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">

              <div className="field">
                <label>Transaction Amount</label>
                <input
                  name="amount"
                  type="number"
                  placeholder="e.g. 7500"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Session Duration</label>
                <input
                  name="session_duration"
                  type="number"
                  placeholder="e.g. 120"
                  value={formData.session_duration}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Amount vs Sender History</label>
                <input
                  name="transaction_amount_vs_sender_history"
                  type="number"
                  step="any"
                  placeholder="e.g. 2.4"
                  value={formData.transaction_amount_vs_sender_history}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Transaction Time</label>
                <input
                  name="transaction_time_of_day"
                  type="number"
                  min="0"
                  max="23"
                  placeholder="0 - 23"
                  value={formData.transaction_time_of_day}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Input Timing Consistency</label>
                <input
                  name="input_timing_consistency"
                  type="number"
                  step="any"
                  placeholder="e.g. 0.85"
                  value={formData.input_timing_consistency}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Keyboard Input Speed</label>
                <input
                  name="keyboard_input_speed"
                  type="number"
                  step="any"
                  placeholder="e.g. 0.9"
                  value={formData.keyboard_input_speed}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Input Pause Patterns</label>
                <input
                  name="input_pause_patterns"
                  type="number"
                  step="any"
                  placeholder="e.g. 0.12"
                  value={formData.input_pause_patterns}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Screen Active Time</label>
                <input
                  name="screen_active_time"
                  type="number"
                  placeholder="e.g. 300"
                  value={formData.screen_active_time}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Geographic Location vs IP</label>
                <input
                  name="geographic_location_vs_ip"
                  type="number"
                  step="any"
                  placeholder="e.g. 9000"
                  value={formData.geographic_location_vs_ip}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Background Data Usage</label>
                <input
                  name="background_data_usage"
                  type="number"
                  step="any"
                  placeholder="e.g. 0.25"
                  value={formData.background_data_usage}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>PIN Entry Speed</label>
                <input
                  name="pin_entry_speed"
                  type="number"
                  step="any"
                  placeholder="e.g. 1.2"
                  value={formData.pin_entry_speed}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Request Amount Roundness</label>
                <input
                  name="request_amount_roundness"
                  type="number"
                  step="any"
                  placeholder="e.g. 1.0"
                  value={formData.request_amount_roundness}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="actions">
              <button
                className="primary-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Analyze Transaction"}
              </button>

              <button
                className="secondary-button"
                type="button"
                onClick={resetForm}
              >
                Clear
              </button>
            </div>
          </form>
        </section>

        {loading && (
          <section className="status-card">
            <div className="loader"></div>
            <p>Analyzing transaction...</p>
          </section>
        )}

        {error && (
          <section className="result-card error-card">
            <p className="result-label">ERROR</p>
            <h2>Prediction Failed</h2>
            <p>{error}</p>
          </section>
        )}

        {result && !error && (
          <section
            className={`result-card ${
              result.prediction === 1
                ? "fraud-card"
                : "legitimate-card"
            }`}
          >
            <p className="result-label">ANALYSIS RESULT</p>

            <h2>{result.result}</h2>

            <div className="probability">
              <span>Fraud Probability</span>

              <strong>
                {(result.fraud_probability * 100).toFixed(2)}%
              </strong>
            </div>

            <div className="probability-bar">
              <div
                className="probability-fill"
                style={{
                  width: `${result.fraud_probability * 100}%`
                }}
              ></div>
            </div>

            <p className="prediction-code">
              Model prediction: {result.prediction}
            </p>
          </section>
        )}

        <footer>
          <p>
            Experimental system using synthetic UPI-style
            transaction data.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;

