import React from 'react';

const StatusIndicator = ({ value }) => {
  const getStatus = (val) => {
    if (val >= 70) return { label: 'Wet', color: '#2ed573', emoji: '💧', bg: 'rgba(46, 213, 115, 0.12)', border: 'rgba(46, 213, 115, 0.3)' };
    if (val >= 30) return { label: 'Normal', color: '#ffa502', emoji: '🌱', bg: 'rgba(255, 165, 2, 0.12)', border: 'rgba(255, 165, 2, 0.3)' };
    return { label: 'Dry', color: '#ff4757', emoji: '🏜️', bg: 'rgba(255, 71, 87, 0.12)', border: 'rgba(255, 71, 87, 0.3)' };
  };

  const status = getStatus(value || 0);

  return (
    <div className="card status-card">
      <h3 className="card-title">
        <span className="card-icon">🔔</span>
        Soil Status
      </h3>
      <div className="status-display" style={{ background: status.bg, borderColor: status.border }}>
        <span className="status-emoji">{status.emoji}</span>
        <span className="status-label" style={{ color: status.color }}>{status.label}</span>
        <span className="status-dot" style={{ backgroundColor: status.color }}></span>
      </div>
      <div className="status-thresholds">
        <div className="threshold">
          <span className="threshold-dot" style={{ backgroundColor: '#2ed573' }}></span>
          <span>Wet (&gt;70%)</span>
        </div>
        <div className="threshold">
          <span className="threshold-dot" style={{ backgroundColor: '#ffa502' }}></span>
          <span>Normal (30-70%)</span>
        </div>
        <div className="threshold">
          <span className="threshold-dot" style={{ backgroundColor: '#ff4757' }}></span>
          <span>Dry (&lt;30%)</span>
        </div>
      </div>
    </div>
  );
};

export default StatusIndicator;
