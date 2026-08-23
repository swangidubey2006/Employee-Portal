import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from './Dashboard/Sidebar.jsx';
import Header from './Dashboard/Header.jsx';
import NotificationToast from './LeftPanel/NotificationToast.jsx';
import { attendanceApi } from '../services/api.js';
import AttendanceCheckInModal from './AttendanceCheckInModal.jsx';
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
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Today's attendance state - loaded from API
  const [todayState, setTodayState] = useState({
    checkIn: '--:--',
    checkOut: '--:--',
    workingHours: '00h 00m',
    status: 'Not Checked In',
    isCheckedIn: false,
  });

  // Stats from API
  const [stats, setStats] = useState({
    presentDays: 0,
    totalWorkingDays: 0,
    absentDays: 0,
    availableLeave: 12,
    attendancePercentage: '0%',
  });

  // History from API
  const [historyData, setHistoryData] = useState([]);

  // Analytics filter state
  const [analyticsRange, setAnalyticsRange] = useState('Last 7 Days');
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  // History table filters & pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [currentPage, setCurrentPage] = useState(1);

  // Load attendance data from API on mount
  useEffect(() => {
    loadAttendanceData();
  }, []);

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      const res = await attendanceApi.getAttendance();
      if (res.success && res.data) {
        const { todayRecord, records, stats: apiStats } = res.data;

        if (todayRecord) {
          setTodayState({
            checkIn: todayRecord.checkInTime || '--:--',
            checkOut: todayRecord.checkOutTime || '--:--',
            workingHours: todayRecord.workingHours || '00h 00m',
            status: todayRecord.status || 'Not Checked In',
            isCheckedIn: todayRecord.status === 'Checked In',
          });
        }

        if (Array.isArray(records)) {
          setHistoryData(records.map((r, idx) => ({
            id: r._id || idx,
            date: r.date,
            dateKey: r.dateKey || '',
            monthKey: r.dateKey ? r.dateKey.slice(0, 7) : '',
            mode: r.workMode || 'Office',
            checkIn: r.checkInTime || '--:--',
            checkOut: r.checkOutTime || '--:--',
            hours: r.workingHours || '00h 00m',
            status: r.status === 'Present' || r.status === 'Checked In' ? 'Present' : r.status,
          })));
        }

        if (apiStats) {
          setStats(apiStats);
        }
      }
    } catch (err) {
      console.error('Failed to load attendance:', err);
      // Keep default fallback data so UI doesn't break
    } finally {
      setLoading(false);
    }
  };

  // Check-in method selection
  const handleCheckIn = useCallback(async ({ workMode, scanCode = '', reason = '' }) => {
    if (actionLoading) return;

    try {
      setActionLoading(true);
      const res = await attendanceApi.checkIn({ workMode, scanCode, reason });

      if (res.success) {
        const record = res.data;
        setTodayState({
          checkIn: record.checkInTime,
          checkOut: '--:--',
          workingHours: '00h 00m',
          status: 'Checked In',
          isCheckedIn: true,
        });
        setToastType('success');
        setToastMessage(
          workMode === 'Home'
            ? `Checked in from Home at ${record.checkInTime}.`
            : `Office check-in successful at ${record.checkInTime}.`
        );
        setShowCheckInModal(false);
        await loadAttendanceData();
      }
    } catch (err) {
      setToastType('error');
      setToastMessage(err.message || 'Failed to check in. Please try again.');
    } finally {
      setActionLoading(false);
    }
  }, [actionLoading]);

  const handleCheckOut = async () => {
    if (actionLoading) return;

    try {
      setActionLoading(true);
      const res = await attendanceApi.checkOut();

      if (res.success) {
        const record = res.data;
        setTodayState({
          checkIn: record.checkInTime,
          checkOut: record.checkOutTime,
          workingHours: record.workingHours,
          status: 'Present',
          isCheckedIn: false,
        });
        setToastType('success');
        setToastMessage(`Successfully checked out at ${record.checkOutTime}.`);
        await loadAttendanceData();
      }
    } catch (err) {
      setToastType('error');
      setToastMessage(err.message || 'Failed to check out. Please try again.');
    } finally {
      setActionLoading(false);
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
    setToastType('success');
    setToastMessage('Exported attendance history to CSV!');
  };

  // Only show records actually returned by MongoDB.
  const displayHistoryData = historyData;

  const monthOptions = useMemo(() => {
    const keys = new Set(historyData.map((item) => item.monthKey).filter(Boolean));
    keys.add(new Date().toISOString().slice(0, 7));

    return Array.from(keys).sort().reverse();
  }, [historyData]);

  const monthLabel = (key) => {
    const [year, month] = key.split('-').map(Number);
    if (!year || !month) return key;
    return new Date(year, month - 1, 1).toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  // Filter dataset by search term
  const filteredData = displayHistoryData.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesMonth = !selectedMonth || item.monthKey === selectedMonth;

    return (
      matchesMonth &&
      (
        item.date.toLowerCase().includes(query) ||
        item.mode.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query)
      )
    );
  });

  // Paginate 5 items per page
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const displayedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Weekly analytics based on real attendance records.
  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const result = days.map((day) => ({ day, hours: 0 }));

    historyData.forEach((item) => {
      if (!item.dateKey) return;
      const date = new Date(`${item.dateKey}T00:00:00`);
      const dayIndex = (date.getDay() + 6) % 7;
      const match = String(item.hours || '').match(/(\d+)h\s+(\d+)m/);
      if (match) {
        result[dayIndex].hours += Number(match[1]) + Number(match[2]) / 60;
      }
    });

    return result;
  }, [historyData]);

  const calendarDays = useMemo(() => {
    const key = selectedMonth || new Date().toISOString().slice(0, 7);
    const [year, month] = key.split('-').map(Number);
    const first = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    const offset = first.getDay();

    const recordMap = new Map(
      historyData
        .filter((item) => item.dateKey)
        .map((item) => [item.dateKey, item.status])
    );

    const cells = [];
    for (let i = 0; i < offset; i += 1) cells.push({ empty: true });

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({
        num: day,
        status: recordMap.get(dateKey),
        isToday: dateKey === new Date().toISOString().slice(0, 10),
      });
    }

    return cells;
  }, [selectedMonth, historyData]);

  return (
    <div className="dashboard-layout">
      {/* Toast Notification */}
      <NotificationToast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />

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
              <span className="attendance-date-label">{new Date().toLocaleDateString("en-US", { weekday: "long", day: "2-digit", month: "short", year: "numeric" })}</span>
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

              <button
                className="btn-mark-attendance"
                onClick={todayState.isCheckedIn ? handleCheckOut : () => setShowCheckInModal(true)}
                disabled={actionLoading}
              >
                {actionLoading
                  ? 'Processing...'
                  : todayState.isCheckedIn
                  ? 'Check Out'
                  : 'Check In'}
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
                  <span className="att-card-val">{stats.presentDays} / {stats.totalWorkingDays}</span>
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
                    <span className="att-card-val">{String(stats.absentDays).padStart(2, '0')}</span>
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
                    <span className="att-card-val">{stats.availableLeave}</span>
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
                  <span className="att-card-val">{stats.attendancePercentage}</span>
                </div>
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
                  <button
                    className="cal-nav-btn"
                    aria-label="Previous Month"
                    onClick={() => {
                      const d = new Date(`${selectedMonth}-01T00:00:00`);
                      d.setMonth(d.getMonth() - 1);
                      setSelectedMonth(d.toISOString().slice(0, 7));
                      setCurrentPage(1);
                    }}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="cal-month-title">{monthLabel(selectedMonth)}</span>
                  <button
                    className="cal-nav-btn"
                    aria-label="Next Month"
                    onClick={() => {
                      const d = new Date(`${selectedMonth}-01T00:00:00`);
                      d.setMonth(d.getMonth() + 1);
                      setSelectedMonth(d.toISOString().slice(0, 7));
                      setCurrentPage(1);
                    }}
                  >
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
                  if (d.status === 'Present') dateClass += ' is-present';
                  if (d.status === 'Absent') dateClass += ' is-absent';
                  if (d.isToday) dateClass += ' is-today-highlight';

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
                    {monthOptions.map((month) => (
                      <option key={month} value={month}>{monthLabel(month)}</option>
                    ))}
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
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>Loading attendance data...</div>
              ) : (
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
              )}
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

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`btn-page-num ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

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
      {showCheckInModal && (
        <AttendanceCheckInModal
          onClose={() => setShowCheckInModal(false)}
          onCheckIn={handleCheckIn}
          loading={actionLoading}
        />
      )}

    </div>
  );
};

export default AttendancePage;
