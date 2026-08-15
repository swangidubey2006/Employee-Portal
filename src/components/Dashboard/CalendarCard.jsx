import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarCard = () => {
  const [currentMonth] = useState('May 2024');

  // Calendar dates matching reference screenshot layout
  const days = [
    { num: 28, isPrev: true },
    { num: 29, isPrev: true },
    { num: 30, isPrev: true },
    { num: 1, status: 'present' },
    { num: 2, status: 'present' },
    { num: 3, status: 'present' },
    { num: 4, status: 'weekend' },
    { num: 5, status: 'present' },
    { num: 6, status: 'present' },
    { num: 7, status: 'absent' },
    { num: 8, status: 'present' },
    { num: 9, status: 'present' },
    { num: 10, isToday: true, status: 'present' },
    { num: 11, status: 'weekend' },
  ];

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <h3 className="card-section-title">My Calendar</h3>
        <div className="calendar-nav-arrows">
          <button className="cal-arrow-btn" aria-label="Previous month">
            <ChevronLeft size={16} />
          </button>
          <button className="cal-arrow-btn" aria-label="Next month">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="calendar-month-title">{currentMonth}</div>

      <div className="calendar-grid">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i} className="cal-day-header">{d}</span>
        ))}

        {days.map((d, index) => {
          let cellClass = 'cal-day-cell';
          if (d.isPrev) cellClass += ' muted';
          if (d.isToday) cellClass += ' is-today';

          return (
            <div key={index} className={cellClass}>
              <span className="day-num">{d.num}</span>
              {d.status === 'present' && <span className="dot dot-green" />}
              {d.status === 'absent' && <span className="dot dot-red" />}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="dot dot-green" />
          <span>Present</span>
        </div>
        <div className="legend-item">
          <span className="dot dot-red" />
          <span>Absent</span>
        </div>
        <div className="legend-item">
          <span className="ring-blue" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarCard;
