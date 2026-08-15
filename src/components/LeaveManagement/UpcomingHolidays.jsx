import React from 'react';
import { ChevronRight } from 'lucide-react';

const UpcomingHolidays = ({ setToastMessage }) => {
  const holidays = [
    {
      id: 1,
      month: 'AUG',
      dayNum: '15',
      title: 'Independence Day',
      dayName: 'Tuesday',
    },
    {
      id: 2,
      month: 'OCT',
      dayNum: '02',
      title: 'Gandhi Jayanti',
      dayName: 'Monday',
    },
    {
      id: 3,
      month: 'DEC',
      dayNum: '25',
      title: 'Christmas',
      dayName: 'Monday',
    },
  ];

  const handleViewAllHolidays = () => {
    setToastMessage('Displaying all company holidays for 2023-2024.');
  };

  return (
    <div className="leave-card-box">
      <h3 className="card-section-title margin-bottom-md">Upcoming Holidays</h3>

      <div className="holidays-list-container">
        {holidays.map((h) => (
          <div key={h.id} className="holiday-list-item">
            <div className="holiday-date-badge">
              <span className="holiday-month-code">{h.month}</span>
              <span className="holiday-day-num">{h.dayNum}</span>
            </div>

            <div className="holiday-title-col">
              <span className="holiday-item-name">{h.title}</span>
              <span className="holiday-item-day">{h.dayName}</span>
            </div>

            <ChevronRight size={18} className="holiday-arrow-icon" />
          </div>
        ))}
      </div>

      <button className="btn-view-all-holidays" onClick={handleViewAllHolidays}>
        View All Holidays
      </button>
    </div>
  );
};

export default UpcomingHolidays;
