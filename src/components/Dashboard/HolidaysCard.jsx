import React from 'react';

const HolidaysCard = () => {
  const holidays = [
    {
      id: 1,
      date: '17',
      month: 'JUNE',
      name: 'Eid al-Adha',
      day: 'Monday',
      accent: 'border-accent-green',
      colorClass: 'text-green',
    },
    {
      id: 2,
      date: '15',
      month: 'AUGUST',
      name: 'Independence Day',
      day: 'Thursday',
      accent: 'border-accent-dark',
      colorClass: 'text-dark',
    },
    {
      id: 3,
      date: '26',
      month: 'AUGUST',
      name: 'Janmashtami',
      day: 'Monday',
      accent: 'border-accent-blue',
      colorClass: 'text-blue',
    },
    {
      id: 4,
      date: '02',
      month: 'OCTOBER',
      name: 'Gandhi Jayanti',
      day: 'Wednesday',
      accent: 'border-accent-red',
      colorClass: 'text-red',
    },
  ];

  return (
    <div className="holidays-section">
      <h3 className="section-heading-title">Upcoming Holidays</h3>

      <div className="holidays-grid">
        {holidays.map((item) => (
          <div key={item.id} className={`holiday-card ${item.accent}`}>
            <div className="holiday-date-col">
              <span className={`holiday-date-num ${item.colorClass}`}>{item.date}</span>
              <span className="holiday-month">{item.month}</span>
            </div>

            <div className="holiday-info-col">
              <span className="holiday-name">{item.name}</span>
              <span className="holiday-day">{item.day}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HolidaysCard;
