import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const LeaveCalendar = () => {
  const months = ['July 2023', 'August 2023', 'September 2023', 'October 2023'];
  const [currentMonthIdx, setCurrentMonthIdx] = useState(1); // August 2023

  const handlePrevMonth = () => {
    if (currentMonthIdx > 0) setCurrentMonthIdx(currentMonthIdx - 1);
  };

  const handleNextMonth = () => {
    if (currentMonthIdx < months.length - 1) setCurrentMonthIdx(currentMonthIdx + 1);
  };

  // Calendar dates layout for August 2023
  const augDays = [
    { num: 28, isPrev: true },
    { num: 29, isPrev: true },
    { num: 1 },
    { num: 2 },
    { num: 3 },
    { num: 4 },
    { num: 5 },
    { num: 6 },
    { num: 7 },
    { num: 8 },
    { num: 9 },
    { num: 10, isSelected: true },
    { num: 11 },
    { num: 12 },
    { num: 13 },
    { num: 14 },
    { num: 15, isApproved: true, isHoliday: true },
    { num: 16, isApproved: true },
    { num: 17, isApproved: true },
    { num: 18, isApproved: true },
    { num: 19 },
    { num: 20 },
    { num: 21 },
    { num: 22 },
    { num: 23 },
    { num: 24 },
    { num: 25 },
    { num: 26 },
    { num: 27 },
    { num: 28 },
    { num: 29 },
    { num: 30 },
    { num: 31 },
  ];

  return (
    <div className="leave-card-box">
      <div className="calendar-card-header">
        <h3 className="card-section-title">Leave Calendar</h3>
        <div className="calendar-nav-controls">
          <button className="cal-arrow-btn" onClick={handlePrevMonth} title="Previous Month">
            <ChevronLeft size={15} />
          </button>
          <button className="cal-arrow-btn" onClick={handleNextMonth} title="Next Month">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="calendar-month-heading">{months[currentMonthIdx]}</div>

      {/* Week Headers */}
      <div className="leave-cal-grid-headers">
        {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((day, idx) => (
          <span key={idx} className="cal-header-day">{day}</span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="leave-cal-grid-dates">
        {augDays.map((d, index) => {
          let cellClass = 'cal-day-box';
          if (d.isPrev) cellClass += ' muted';
          if (d.isSelected) cellClass += ' is-selected-date';
          if (d.isApproved) cellClass += ' is-approved-date';

          return (
            <div key={index} className={cellClass}>
              <span>{d.num}</span>
            </div>
          );
        })}
      </div>

      {/* Calendar Legend */}
      <div className="leave-calendar-legend">
        <div className="legend-item">
          <span className="legend-dot dot-approved" />
          <span>Approved</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-pending" />
          <span>Pending</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-rejected" />
          <span>Rejected</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-holidays" />
          <span>Holidays</span>
        </div>
      </div>
    </div>
  );
};

export default LeaveCalendar;
