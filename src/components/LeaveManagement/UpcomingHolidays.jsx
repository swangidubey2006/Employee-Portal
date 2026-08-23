import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, CalendarDays } from 'lucide-react';
import { holidayApi } from '../../services/api.js';

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const UpcomingHolidays = ({ setToastMessage, referenceMonth }) => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  const effectiveMonth = useMemo(() => {
    const today = startOfDay(new Date());
    const viewed = referenceMonth || today;
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const selectedMonth = new Date(viewed.getFullYear(), viewed.getMonth(), 1);
    return selectedMonth < currentMonth ? currentMonth : selectedMonth;
  }, [referenceMonth]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const res = await holidayApi.getHolidays({
          year: effectiveMonth.getFullYear(),
          month: effectiveMonth.getMonth(),
        });
        if (!cancelled) setHolidays(Array.isArray(res?.data) ? res.data : []);
      } catch (error) {
        if (!cancelled) {
          setHolidays([]);
          setToastMessage?.(error.message || 'Unable to load upcoming holidays.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [effectiveMonth, setToastMessage]);

  const upcoming = useMemo(() => {
    const today = startOfDay(new Date());
    return holidays
      .map((holiday) => ({ ...holiday, dateObj: new Date(holiday.date) }))
      .filter((holiday) => startOfDay(holiday.dateObj) >= today)
      .sort((a, b) => a.dateObj - b.dateObj)
      .slice(0, 3);
  }, [holidays]);

  const handleViewAllHolidays = () => {
    if (!upcoming.length) {
      setToastMessage?.('No upcoming holidays found for this period.');
      return;
    }
    setToastMessage?.(`Showing ${upcoming.length} upcoming holiday${upcoming.length === 1 ? '' : 'ies'}.`);
  };

  return (
    <div className="leave-card-box">
      <div className="card-section-title-row">
        <h3 className="card-section-title margin-bottom-md">Upcoming Holidays</h3>
        <CalendarDays size={18} aria-hidden="true" />
      </div>

      <div className="holidays-list-container">
        {loading ? (
          <div className="holiday-empty-state">Loading holidays...</div>
        ) : upcoming.length === 0 ? (
          <div className="holiday-empty-state">No upcoming holidays.</div>
        ) : (
          upcoming.map((h) => (
            <div key={h._id || `${h.name}-${h.date}`} className="holiday-list-item">
              <div className="holiday-date-badge">
                <span className="holiday-month-code">
                  {h.dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase()}
                </span>
                <span className="holiday-day-num">{String(h.dateObj.getDate()).padStart(2, '0')}</span>
              </div>

              <div className="holiday-title-col">
                <span className="holiday-item-name">{h.name}</span>
                <span className="holiday-item-day">
                  {h.dateObj.toLocaleString('en-US', { weekday: 'long' })}
                </span>
              </div>

              <ChevronRight size={18} className="holiday-arrow-icon" />
            </div>
          ))
        )}
      </div>

      <button className="btn-view-all-holidays" onClick={handleViewAllHolidays}>
        View All Holidays
      </button>
    </div>
  );
};

export default UpcomingHolidays;
