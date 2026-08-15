import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const AttendanceAnalytics = () => {
  const [range, setRange] = useState('Last 30 Days');

  // Chart data matching reference values
  const chartData = [
    { day: 'Mon', height: '25%', active: false },
    { day: 'Tue', height: '48%', active: false },
    { day: 'Wed', height: '70%', active: false },
    { day: 'Thu', height: '62%', active: false },
    { day: 'Fri', height: '78%', active: true },
    { day: 'Sat', height: '12%', active: false },
    { day: 'Sun', height: '12%', active: false },
  ];

  return (
    <div className="analytics-card">
      <div className="analytics-header">
        <div>
          <h3 className="card-section-title">Attendance Analytics</h3>
          <p className="card-section-sub">
            Tracking your productivity trends over the last 30 days
          </p>
        </div>

        <div className="custom-select-wrapper">
          <select 
            value={range} 
            onChange={(e) => setRange(e.target.value)}
            className="analytics-select"
          >
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="This Month">This Month</option>
          </select>
          <ChevronDown size={14} className="select-arrow" />
        </div>
      </div>

      <div className="bar-chart-container">
        {chartData.map((item) => (
          <div key={item.day} className="bar-col">
            <div className="bar-track">
              <div 
                className={`bar-fill ${item.active ? 'active-bar' : ''}`}
                style={{ height: item.height }}
              >
                <div className="bar-top-cap" />
              </div>
            </div>
            <span className={`bar-label ${item.active ? 'active-label' : ''}`}>
              {item.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceAnalytics;
