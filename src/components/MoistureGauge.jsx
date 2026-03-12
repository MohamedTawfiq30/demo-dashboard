import React, { useEffect, useRef } from 'react';

const MoistureGauge = ({ value }) => {
  const canvasRef = useRef(null);
  const pct = Math.max(0, Math.min(100, value || 0));

  // Interpolate color: red (0%) → yellow (50%) → green (100%)
  const getColor = (p) => {
    if (p >= 70) return '#2ed573';
    if (p >= 30) return '#ffa502';
    return '#ff4757';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H * 0.78;
    const R = Math.min(W, H) * 0.42;
    const startAngle = Math.PI;           // 180°
    const endAngle = 2 * Math.PI;        // 360° (full half circle)
    const valueAngle = Math.PI + (pct / 100) * Math.PI;

    ctx.clearRect(0, 0, W, H);

    // ── Track (background arc) ──
    ctx.beginPath();
    ctx.arc(cx, cy, R, startAngle, endAngle);
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 22;
    ctx.lineCap = 'round';
    ctx.stroke();

    // ── Color segments ──
    const segments = [
      { from: 0,   to: 30,  color: '#ff4757' },
      { from: 30,  to: 70,  color: '#ffa502' },
      { from: 70,  to: 100, color: '#2ed573' },
    ];
    segments.forEach(({ from, to, color }) => {
      const a1 = Math.PI + (from / 100) * Math.PI;
      const a2 = Math.PI + (to   / 100) * Math.PI;
      ctx.beginPath();
      ctx.arc(cx, cy, R, a1, a2);
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 22;
      ctx.lineCap = 'butt';
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    // ── Active arc (value fill) ──
    const grad = ctx.createLinearGradient(cx - R, cy, cx + R, cy);
    grad.addColorStop(0,   '#ff4757');
    grad.addColorStop(0.4, '#ffa502');
    grad.addColorStop(1,   '#2ed573');
    ctx.beginPath();
    ctx.arc(cx, cy, R, startAngle, valueAngle);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 22;
    ctx.lineCap = 'round';
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 18;
    ctx.shadowColor = getColor(pct);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // ── Needle ──
    const needleAngle = valueAngle;
    const needleLen = R * 0.72;
    const nx = cx + needleLen * Math.cos(needleAngle);
    const ny = cy + needleLen * Math.sin(needleAngle);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(nx, ny);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    // ── Needle base circle ──
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // ── Value text ──
    ctx.textAlign = 'center';
    ctx.fillStyle = getColor(pct);
    ctx.font = `bold ${W * 0.115}px Inter, sans-serif`;
    ctx.shadowBlur = 12;
    ctx.shadowColor = getColor(pct);
    ctx.fillText(`${Math.round(pct)}%`, cx, cy - R * 0.28);
    ctx.shadowBlur = 0;

    // ── Labels ──
    ctx.font = `500 ${W * 0.055}px Inter, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillText('0%',   cx - R - 4,  cy + 22);
    ctx.fillText('100%', cx + R + 4,  cy + 22);
  }, [pct]);

  return (
    <div className="card gauge-card">
      <h3 className="card-title">
        <span className="card-icon">⚡</span>
        Moisture Gauge
      </h3>
      <div className="gauge-wrapper">
        <canvas
          ref={canvasRef}
          width={340}
          height={200}
          style={{ width: '100%', maxWidth: '340px', height: 'auto' }}
        />
      </div>
      <p className="gauge-label">Current Soil Moisture Level</p>
    </div>
  );
};

export default MoistureGauge;
