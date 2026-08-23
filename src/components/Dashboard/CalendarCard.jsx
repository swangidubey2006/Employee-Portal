import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { attendanceApi } from '../../services/api.js';

const toDateKey = (date) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const CalendarCard = () => {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [attendanceDates, setAttendanceDates] = useState(new Set());

  useEffect(() => {
    let mounted = true;
    attendanceApi.getAttendance()
      .then((res) => {
        if (!mounted) return;
        const records = Array.isArray(res?.data?.records) ? res.data.records : [];
        setAttendanceDates(new Set(records.map((record) => toDateKey(record.date || record.checkInDate || record.createdAt))));
      })
      .catch(() => {
        if (mounted) setAttendanceDates(new Set());
      });
    return () => { mounted = false; };
  }, []);

  const { label, days } = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const previousTotal = new Date(year, month, 0).getDate();
    const today = new Date();
    const cells = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ num: previousTotal - i, muted: true });
    }

    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, month, d);
      cells.push({
        num: d,
        isToday: today.getFullYear() === year && today.getMonth() === month && today.getDate() === d,
        status: attendanceDates.has(toDateKey(date)) ? 'present' : undefined,
      });
    }

    while (cells.length < 42) {
      cells.push({ num: cells.length - (firstDay + totalDays) + 1, muted: true });
    }

    return {
      label: cursor.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      days: cells,
    };
  }, [cursor, attendanceDates]);

  const moveMonth = (amount) => {
    setCursor((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <h3 className="card-section-title">My Calendar</h3>
        <div className="calendar-nav-arrows">
          <button type="button" className="cal-arrow-btn" aria-label="Previous month" onClick={() => moveMonth(-1)}>
            <ChevronLeft size={16} />
          </button>
          <button type="button" className="cal-arrow-btn" aria-label="Next month" onClick={() => moveMonth(1)}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="calendar-month-title">{label}</div>
      <div className="calendar-grid">
        {['S','M','T','W','T','F','S'].map((d, i) => <span key={i} className="cal-day-header">{d}</span>)}
        {days.map((d, index) => (
          <div key={index} className={`cal-day-cell${d.muted ? ' muted' : ''}${d.isToday ? ' is-today' : ''}`}>
            <span className="day-num">{d.num}</span>
            {d.status === 'present' && <span className="dot dot-green" />}
          </div>
        ))}
      </div>
      <div className="calendar-legend">
        <div className="legend-item"><span className="dot dot-green" /><span>Checked in</span></div>
        <div className="legend-item"><span className="ring-blue" /><span>Today</span></div>
      </div>
    </div>
  );
};

export default CalendarCard;
