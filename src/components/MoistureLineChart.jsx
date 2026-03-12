import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MoistureLineChart = ({ history }) => {
  const labels = history.map((_, i) => {
    const time = new Date(Date.now() - (history.length - 1 - i) * 3000);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Soil Moisture (%)',
        data: history,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(46, 213, 115, 0.4)');
          gradient.addColorStop(0.5, 'rgba(255, 165, 2, 0.15)');
          gradient.addColorStop(1, 'rgba(255, 71, 87, 0.05)');
          return gradient;
        },
        borderColor: '#2ed573',
        borderWidth: 2.5,
        pointBackgroundColor: '#2ed573',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#b0b8c8',
          font: { size: 13, family: 'Inter' },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(20, 25, 40, 0.95)',
        titleColor: '#fff',
        bodyColor: '#b0b8c8',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
        callbacks: {
          label: (ctx) => `Moisture: ${ctx.parsed.y}%`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#6b7280',
          font: { size: 11, family: 'Inter' },
          maxRotation: 45,
          maxTicksLimit: 8,
        },
        grid: {
          color: 'rgba(255,255,255,0.04)',
        },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          color: '#6b7280',
          font: { size: 12, family: 'Inter' },
          stepSize: 20,
          callback: (val) => `${val}%`,
        },
        grid: {
          color: 'rgba(255,255,255,0.06)',
        },
      },
    },
    animation: {
      duration: 800,
      easing: 'easeInOutCubic',
    },
  };

  return (
    <div className="card chart-card">
      <h3 className="card-title">
        <span className="card-icon">📈</span>
        Moisture History
      </h3>
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default MoistureLineChart;
