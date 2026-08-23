import React, { useMemo } from 'react';

const HOLIDAY_RULES = [
  { month: 0, day: 26, name: 'Republic Day', accent: 'border-accent-blue', colorClass: 'text-blue' },
  { month: 4, day: 1, name: 'Labour Day', accent: 'border-accent-green', colorClass: 'text-green' },
  { month: 7, day: 15, name: 'Independence Day', accent: 'border-accent-dark', colorClass: 'text-dark' },
  { month: 9, day: 2, name: 'Gandhi Jayanti', accent: 'border-accent-red', colorClass: 'text-red' },
  { month: 10, day: 14, name: 'Children’s Day', accent: 'border-accent-blue', colorClass: 'text-blue' },
];

const HolidaysCard = () => {
  const upcoming = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();

    return HOLIDAY_RULES
      .map((holiday) => {
        const date = new Date(year, holiday.month, holiday.day);
        if (date < today) date.setFullYear(year + 1);
        return {
          ...holiday,
          date: date.getDate(),
          month: date.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
          day: date.toLocaleString('en-US', { weekday: 'long' }),
          timestamp: date.getTime(),
        };
      })
      .filter((item) => item.timestamp >= today.getTime())
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(0, 4);
  }, []);

  return (
    <div className="holidays-section">
      <h3 className="section-heading-title">Upcoming Events</h3>
      <div className="holidays-grid">
        {upcoming.map((item) => (
          <div key={`${item.name}-${item.timestamp}`} className={`holiday-card ${item.accent}`}>
            <div className="holiday-date-col">
              <span className={`holiday-date-num ${item.colorClass}`}>{String(item.date).padStart(2, '0')}</span>
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
