import React, { useState, useEffect, useRef } from 'react';
import { database, ref, onValue } from './firebase';
import MoistureGauge from './components/MoistureGauge';
import MoistureLineChart from './components/MoistureLineChart';
import StatusIndicator from './components/StatusIndicator';
import './App.css';

function App() {
  const [moisture, setMoisture] = useState(0);
  const [history, setHistory] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const maxHistory = 20;

  useEffect(() => {
    const moistureRef = ref(database, '/sensor/soilMoisture');

    const unsubscribe = onValue(
      moistureRef,
      (snapshot) => {
        const val = snapshot.val();
        if (val !== null && val !== undefined) {
          const numVal = typeof val === 'object' ? val.value || 0 : Number(val);
          setMoisture(numVal);
          setHistory((prev) => {
            const updated = [...prev, numVal];
            return updated.slice(-maxHistory);
          });
          setLastUpdated(new Date());
          setIsConnected(true);
        }
      },
      (error) => {
        console.error('Firebase error:', error);
        setIsConnected(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getStatusColor = (val) => {
    if (val >= 70) return '#2ed573';
    if (val >= 30) return '#ffa502';
    return '#ff4757';
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <span className="logo-icon">🌿</span>
              <div>
                <h1 className="header-title">Smart Irrigation Monitoring System</h1>
                <p className="header-subtitle">Real-time Soil Moisture Dashboard</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className={`connection-badge ${isConnected ? 'connected' : 'disconnected'}`}>
              <span className="connection-dot"></span>
              {isConnected ? 'Live' : 'Connecting...'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Top Stats Row */}
        <div className="stats-row">
          <div className="card live-value-card">
            <div className="live-value-header">
              <span className="card-icon">💧</span>
              <span className="live-label">Current Moisture</span>
            </div>
            <div className="live-value" style={{ color: getStatusColor(moisture) }}>
              {Math.round(moisture)}
              <span className="live-unit">%</span>
            </div>
            {lastUpdated && (
              <p className="last-updated">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          <StatusIndicator value={moisture} />

          <div className="card info-card">
            <h3 className="card-title">
              <span className="card-icon">📊</span>
              Quick Stats
            </h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{history.length}</span>
                <span className="stat-label">Readings</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {history.length > 0 ? Math.round(Math.max(...history)) : 0}%
                </span>
                <span className="stat-label">Peak</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {history.length > 0 ? Math.round(Math.min(...history)) : 0}%
                </span>
                <span className="stat-label">Low</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {history.length > 0
                    ? Math.round(history.reduce((a, b) => a + b, 0) / history.length)
                    : 0}%
                </span>
                <span className="stat-label">Average</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="charts-row">
          <MoistureGauge value={moisture} />
          <MoistureLineChart history={history} />
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>🌱 Smart Irrigation System • Powered by Firebase Realtime Database</p>
      </footer>
    </div>
  );
}

export default App;
