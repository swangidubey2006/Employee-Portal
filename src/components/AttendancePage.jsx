import React, { useState } from 'react';
import Sidebar from './Dashboard/Sidebar.jsx';
import Header from './Dashboard/Header.jsx';
import NotificationToast from './LeftPanel/NotificationToast.jsx';
import {
  CheckCircle2,
  UserCheck,
  UserX,
  Umbrella,
  TrendingUp,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar as CalendarIcon
} from 'lucide-react';

const AttendancePage = () => {
  // Toast notification message
  const [toastMessage, setToastMessage] = useState('');

  // Today's attendance state
  const [todayState, setTodayState] = useState({
    checkIn: '09:12 AM',
    checkOut: '--:--',
    workingHours: '07h 45m',
    status: 'Checked In',
    isCheckedIn: true,
  });

  // Analytics filter state
  const [analyticsRange, setAnalyticsRange] = useState('Last 7 Days');

  // History table filters & pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('October 2023');
  const [currentPage, setCurrentPage] = useState(1);

  // Reference attendance history dataset
  const fullHistoryData = [
    { id: 1, date: '22 Oct 2023', mode: 'Office', checkIn: '09:05 AM', checkOut: '06:12 PM', hours: '09h 07m', status: 'Present' },
    { id: 2, date: '21 Oct 2023', mode: 'Remote', checkIn: '09:10 AM', checkOut: '06:05 PM', hours: '08h 55m', status: 'Present' },
    { id: 3, date: '20 Oct 2023', mode: 'Office', checkIn: '--:--', checkOut: '--:--', hours: '00h 00m', status: 'Absent' },
    { id: 4, date: '19 Oct 2023', mode: 'Office', checkIn: '08:55 AM', checkOut: '06:15 PM', hours: '09h 20m', status: 'Present' },
    { id: 5, date: '18 Oct 2023', mode: 'Office', checkIn: '09:02 AM', checkOut: '06:00 PM', hours: '08h 58m', status: 'Present' },
    // Page 2 data entries
    { id: 6, date: '17 Oct 2023', mode: 'Office', checkIn: '09:00 AM', checkOut: '06:10 PM', hours: '09h 10m', status: 'Present' },
    { id: 7, date: '16 Oct 2023', mode: 'Remote', checkIn: '09:15 AM', checkOut: '06:00 PM', hours: '08h 45m', status: 'Present' },
    { id: 8, date: '15 Oct 2023', mode: 'Office', checkIn: '08:58 AM', checkOut: '06:20 PM', hours: '09h 22m', status: 'Present' },
    { id: 9, date: '14 Oct 2023', mode: 'Office', checkIn: '09:04 AM', checkOut: '06:05 PM', hours: '09h 01m', status: 'Present' },
    { id: 10, date: '13 Oct 2023', mode: 'Remote', checkIn: '09:10 AM', checkOut: '06:15 PM', hours: '09h 05m', status: 'Present' },
  ];

  // Mark Attendance action
  const handleMarkAttendance = () => {
    if (todayState.isCheckedIn) {
      setTodayState({
        checkIn: '09:12 AM',
        checkOut: '06:15 PM',
        workingHours: '09h 03m',
        status: 'Checked Out',
        isCheckedIn: false,
      });
      setToastMessage('Attendance updated: Successfully Checked Out at 06:15 PM.');
    } else {
      setTodayState({
        checkIn: '09:12 AM',
        checkOut: '--:--',
        workingHours: '07h 45m',
        status: 'Checked In',
        isCheckedIn: true,
      });
      setToastMessage('Attendance updated: Successfully Checked In at 09:12 AM.');
    }
  };

  // CSV Export action
  const handleDownloadCSV = () => {
    const headers = ['Date', 'Work Mode', 'Check-In', 'Check-Out', 'Working Hours', 'Status'];
    const rows = filteredData.map(item => [item.date, item.mode, item.checkIn, item.checkOut, item.hours, item.status]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Attendance_History_${selectedMonth.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage('Exported attendance history to CSV!');
  };

  // Filter dataset by search term
  const filteredData = fullHistoryData.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      item.date.toLowerCase().includes(query) ||
      item.mode.toLowerCase().includes(query) ||
      item.status.toLowerCase().includes(query)
    );
  });

  // Paginate 5 items per page
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const displayedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Weekly analytics data matching screenshot
  const weeklyData = [
    { day: 'Mon', hours: 9.1, active: false },
    { day: 'Tue', hours: 8.9, active: false },
    { day: 'Wed', hours: 0, active: false },
    { day: 'Thu', hours: 9.3, active: false },
    { day: 'Fri', hours: 8.9, active: false },
    { day: 'Sat', hours: 0, active: false },
    { day: 'Sun', hours: 0, active: false },
  ];

  // Calendar dates matching October 2023 screenshot layout
  const calendarDays = [
    { num: 24, isPrev: true },
    { num: 25, isPrev: true },
    { num: 26, isPrev: true },
    { num: 27, isPrev: true },
    { num: 28, isPrev: true },
    { num: 29, isPrev: true },
    { num: 1, status: 'holiday', isSun: true },
    { num: 2, status: 'present' },
    { num: 3, status: 'present' },
    { num: 4, status: 'present' },
    { num: 5, status: 'present' },
    { num: 6, status: 'present' },
    { num: 7, status: 'present' },
    { num: 8, status: 'holiday', isSun: true },
    { num: 9, status: 'present' },
    { num: 10, status: 'present' },
    { num: 11, status: 'present' },
    { num: 12, status: 'present' },
    { num: 13, status: 'present' },
    { num: 14, status: 'present' },
    { num: 15, status: 'holiday', isSun: true },
    { num: 16, status: 'present' },
    { num: 17, status: 'present' },
    { num: 18, status: 'present' },
    { num: 19, status: 'present' },
    { num: 20, status: 'absent' },
    { num: 21, status: 'present' },
    { num: 22, status: 'holiday', isSun: true },
    { num: 23, status: 'present', isToday: true },
    { num: 24, status: 'present' },
    { num: 25, status: 'present' },
    { num: 26, status: 'present' },
    { num: 27, status: 'present' },
    { num: 28, status: 'present' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Toast Notification */}
      <NotificationToast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="dashboard-main-content">
        <Header />

        <div className="dashboard-scroll-body attendance-page-body">
          {/* Page Top Heading Bar */}
          <div className="attendance-page-header">
            <h2 className="attendance-main-title">Attendance Management</h2>

            <div className="attendance-header-right">
              <span className="attendance-date-label">Monday, 23 Oct 2023</span>
              <span className="badge-active-session">Active Session</span>
            </div>
          </div>

          {/* TOP SECTION: Today's Attendance Card + 4 Summary Cards */}
          <div className="attendance-top-grid">
            {/* Today's Attendance Card */}
            <div className="today-attendance-card">
              <div className="card-heading-row">
                <div className="heading-left-group">
                  <CheckCircle2 size={18} className="icon-green-check" />
                  <h3 className="card-section-title">Today's Attendance</h3>
                </div>
              </div>

              <div className="today-stats-grid">
                <div className="today-stat-box">
                  <span className="stat-box-label">Check-In</span>
                  <span className="stat-box-val">{todayState.checkIn}</span>
                </div>

                <div className="today-stat-box">
                  <span className="stat-box-label">Check-Out</span>
                  <span className="stat-box-val">{todayState.checkOut}</span>
                </div>

                <div className="today-stat-box">
                  <span className="stat-box-label">Working Hours</span>
                  <span className="stat-box-val">{todayState.workingHours}</span>
                </div>

                <div className="today-stat-box status-highlight-box">
                  <span className="stat-box-label">Status</span>
                  <span className={`stat-box-val ${todayState.isCheckedIn ? 'text-emerald' : 'text-slate'}`}>
                    {todayState.status}
                  </span>
                </div>
              </div>

              <button className="btn-mark-attendance" onClick={handleMarkAttendance}>
                Mark Attendance
              </button>
            </div>

            {/* 4 Summary Cards Grid */}
            <div className="attendance-summary-grid">
              {/* Card 1: Present Days */}
              <div className="att-summary-card">
                <div className="att-card-top">
                  <div className="att-icon-circle bg-slate-light">
                    <UserCheck size={18} className="text-slate-dark" />
                  </div>
                  <span className="badge-on-track">On Track</span>
                </div>
                <div className="att-card-bottom">
                  <span className="att-card-label">Present Days</span>
                  <span className="att-card-val">22 / 26</span>
                </div>
              </div>

              {/* Card 2: Absent Days */}
              <div className="att-summary-card">
                <div className="att-card-top">
                  <div className="att-icon-circle bg-pink-light">
                    <UserX size={18} className="text-rose" />
                  </div>
                </div>
                <div className="att-card-bottom">
                  <span className="att-card-label">Absent Days</span>
                  <div className="att-val-unit-row">
                    <span className="att-card-val">01</span>
                    <span className="att-card-unit">Day</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Available Leave */}
              <div className="att-summary-card">
                <div className="att-card-top">
                  <div className="att-icon-circle bg-slate-light">
                    <Umbrella size={18} className="text-slate-dark" />
                  </div>
                </div>
                <div className="att-card-bottom">
                  <span className="att-card-label">Available Leave</span>
                  <div className="att-val-unit-row">
                    <span className="att-card-val">12</span>
                    <span className="att-card-unit">Days</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Attendance % */}
              <div className="att-summary-card rel-card">
                <div className="att-card-top">
                  <div className="att-icon-circle bg-emerald-light">
                    <TrendingUp size={18} className="text-emerald" />
                  </div>
                </div>
                <div className="att-card-bottom">
                  <span className="att-card-label">Attendance %</span>
                  <span className="att-card-val">98%</span>
                </div>
                {/* Background chart vector line */}
                <div className="trend-line-bg" />
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION: Weekly Analytics & My Calendar */}
          <div className="attendance-middle-grid">
            {/* Weekly Analytics Card */}
            <div className="analytics-card-large">
              <div className="analytics-header-row">
                <div>
                  <h3 className="card-section-title">Weekly Analytics</h3>
                  <p className="card-section-sub">Working hours vs standard (9h)</p>
                </div>

                <div className="custom-select-wrapper">
                  <select
                    value={analyticsRange}
                    onChange={(e) => setAnalyticsRange(e.target.value)}
                    className="analytics-select"
                  >
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="This Month">This Month</option>
                    <option value="Previous Week">Previous Week</option>
                  </select>
                  <ChevronDown size={14} className="select-arrow" />
                </div>
              </div>

              {/* Bar Chart Visualization */}
              <div className="analytics-chart-wrapper">
                <div className="chart-baseline-grid" />
                <div className="analytics-bars-row">
                  {weeklyData.map((item) => (
                    <div key={item.day} className="analytics-bar-col">
                      <div className="bar-track-outer">
                        {item.hours > 0 && (
                          <div
                            className="bar-fill-inner"
                            style={{ height: `${(item.hours / 10) * 100}%` }}
                          />
                        )}
                      </div>
                      <span className="bar-day-name">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* My Calendar Card */}
            <div className="calendar-card-compact">
              <div className="calendar-card-header">
                <h3 className="card-section-title">My Calendar</h3>
                <div className="cal-month-nav">
                  <button className="cal-nav-btn" aria-label="Previous Month">
                    <ChevronLeft size={14} />
                  </button>
                  <span className="cal-month-title">October 2023</span>
                  <button className="cal-nav-btn" aria-label="Next Month">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="cal-grid-headers">
                {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((d, i) => (
                  <span key={i} className="cal-header-label">{d}</span>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="cal-grid-dates">
                {calendarDays.map((d, idx) => {
                  let dateClass = 'cal-date-cell';
                  if (d.isPrev) dateClass += ' is-muted';
                  if (d.isToday) dateClass += ' is-today-highlight';
                  if (d.isSun) dateClass += ' is-sunday';

                  return (
                    <div key={idx} className={dateClass}>
                      <span className="date-num-val">{d.num}</span>
                    </div>
                  );
                })}
              </div>

              {/* Calendar Legend */}
              <div className="calendar-mini-legend">
                <div className="legend-pair">
                  <span className="legend-dot green-dot" />
                  <span>Present</span>
                </div>
                <div className="legend-pair">
                  <span className="legend-dot red-dot" />
                  <span>Absent</span>
                </div>
                <div className="legend-pair">
                  <span className="legend-dot black-dot" />
                  <span>Holiday</span>
                </div>
              </div>
            </div>
          </div>

          {/* LOWER SECTION: Attendance History Table Card */}
          <div className="history-table-card">
            <div className="history-header-row">
              <h3 className="card-section-title">Attendance History</h3>

              <div className="history-controls-group">
                {/* Search / Date Filter */}
                <div className="search-filter-input-wrapper">
                  <Search size={14} className="search-filter-icon" />
                  <input
                    type="text"
                    className="search-filter-input"
                    placeholder="Filter by date..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Month Dropdown */}
                <div className="custom-select-wrapper">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="analytics-select"
                  >
                    <option value="October 2023">October 2023</option>
                    <option value="September 2023">September 2023</option>
                    <option value="August 2023">August 2023</option>
                  </select>
                  <ChevronDown size={14} className="select-arrow" />
                </div>

                {/* Download Button */}
                <button
                  className="btn-download-icon"
                  onClick={handleDownloadCSV}
                  title="Download Attendance Data"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>

            {/* Attendance History Table */}
            <div className="table-responsive-wrapper">
              <table className="attendance-data-table">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>WORK MODE</th>
                    <th>CHECK-IN</th>
                    <th>CHECK-OUT</th>
                    <th>WORKING HOURS</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedData.length > 0 ? (
                    displayedData.map((row) => (
                      <tr key={row.id}>
                        <td className="font-bold-date">{row.date}</td>
                        <td>{row.mode}</td>
                        <td className={row.checkIn === '--:--' ? 'text-rose' : ''}>{row.checkIn}</td>
                        <td className={row.checkOut === '--:--' ? 'text-rose' : ''}>{row.checkOut}</td>
                        <td>{row.hours}</td>
                        <td>
                          <span className={`status-pill ${row.status === 'Present' ? 'status-pill-present' : 'status-pill-absent'}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center-empty">
                        No attendance records match your search filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Pagination */}
            <div className="history-table-footer">
              <span className="pagination-info-text">
                Showing {displayedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
              </span>

              <div className="pagination-buttons-group">
                <button
                  className="btn-page-nav"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>

                <button
                  className={`btn-page-num ${currentPage === 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </button>

                <button
                  className={`btn-page-num ${currentPage === 2 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(2)}
                >
                  2
                </button>

                <button
                  className="btn-page-nav"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendancePage;
