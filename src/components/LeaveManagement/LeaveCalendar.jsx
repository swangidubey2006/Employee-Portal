import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const LeaveCalendar = ({ onMonthChange }) => {
  const [cursor, setCursor] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const days = useMemo(() => {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    const first = new Date(y, m, 1).getDay();
    const total = new Date(y, m + 1, 0).getDate();
    const prev = new Date(y, m, 0).getDate();
    const today = new Date();
    const out = [];

    for (let i = first - 1; i >= 0; i--) out.push({ num: prev - i, muted: true });
    for (let d = 1; d <= total; d++) {
      out.push({
        num: d,
        isToday: today.getFullYear() === y && today.getMonth() === m && today.getDate() === d,
      });
    }
    while (out.length % 7 !== 0) out.push({ num: out.length - (first + total) + 1, muted: true });
    return out;
  }, [cursor]);

  const move = (n) => {
    setCursor((current) => {
      const next = new Date(current.getFullYear(), current.getMonth() + n, 1);
      onMonthChange?.(next);
      return next;
    });
  };

  return (
    <div className="leave-card-box">
      <div className="calendar-card-header">
        <h3 className="card-section-title">Leave Calendar</h3>
        <div className="calendar-nav-controls">
          <button type="button" className="cal-arrow-btn" onClick={() => move(-1)} aria-label="Previous Month">
            <ChevronLeft size={15} />
          </button>
          <button type="button" className="cal-arrow-btn" onClick={() => move(1)} aria-label="Next Month">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="calendar-month-heading">
        {cursor.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
      </div>

      <div className="leave-cal-grid-headers">
        {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((d) => (
          <span key={d} className="cal-header-day">{d}</span>
        ))}
      </div>

      <div className="leave-cal-grid-dates">
        {days.map((d, i) => (
          <div key={i} className={`cal-day-box${d.muted ? ' muted' : ''}${d.isToday ? ' is-selected-date' : ''}`}>
            <span>{d.num}</span>
          </div>
        ))}
      </div>

      <div className="leave-calendar-legend">
        <div className="legend-item"><span className="legend-dot dot-approved" /><span>Approved</span></div>
        <div className="legend-item"><span className="ring-blue" /><span>Today</span></div>
      </div>
    </div>
  );
};

export default LeaveCalendar;
