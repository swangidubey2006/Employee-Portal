import React, { useState } from 'react';
import { Filter, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

const LeaveRequestHistory = ({ historyList, loading }) => {

  const [statusFilter, setStatusFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState('All');

  // Filter history records
  const filteredHistory = historyList.filter((item) => {
    const matchesStatus =
      statusFilter === 'All' || item.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesMonth =
      monthFilter === 'All' ||
      item.dates.toLowerCase().includes(monthFilter.toLowerCase()) ||
      item.appliedOn.toLowerCase().includes(monthFilter.toLowerCase());
    return matchesStatus && matchesMonth;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'badge-status-approved';
      case 'Pending':
        return 'badge-status-pending';
      case 'Rejected':
        return 'badge-status-rejected';
      default:
        return 'badge-status-pending';
    }
  };

  return (
    <div className="leave-card-box">
      <div className="leave-card-header">
        <h3 className="card-section-title">Leave Request History</h3>

        <div className="history-filters-group">
          {/* Status Filter */}
          <div className="filter-pill-wrapper">
            <Filter size={13} className="filter-icon" />
            <span className="filter-label-prefix">Status:</span>
            <select
              className="filter-select-inline"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
            <ChevronDown size={13} className="filter-arrow" />
          </div>

          {/* Month Filter */}
          <div className="filter-pill-wrapper">
            <CalendarIcon size={13} className="filter-icon" />
            <span className="filter-label-prefix">Month:</span>
            <select
              className="filter-select-inline"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            >
              <option value="All">All</option>
              {Array.from(
                new Map(
                  historyList.map((item) => {
                    const source = item.appliedOn || item.dates || "";
                    const match = source.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i);
                    const key = match ? match[1] : null;
                    return key ? [key, key] : null;
                  }).filter(Boolean)
                ).keys()
              ).map((month) => (
                <option key={month} value={month}>
                  {new Date(`${month} 1, 2024`).toLocaleString("en-US", { month: "long" })}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="filter-arrow" />
          </div>
        </div>
      </div>

      <div className="table-responsive-wrapper">
        <table className="leave-history-table">
          <thead>
            <tr>
              <th>REQUEST ID</th>
              <th>LEAVE TYPE</th>
              <th>DATES</th>
              <th>DAYS</th>
              <th>APPLIED ON</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((row) => (
                <tr key={row.id}>
                  <td className="font-bold-id">{row.id}</td>
                  <td>{row.leaveType}</td>
                  <td>{row.dates}</td>
                  <td>{row.days}</td>
                  <td>{row.appliedOn}</td>
                  <td>
                    <span className={`status-pill ${getStatusBadgeClass(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center-empty">
                  No leave requests match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequestHistory;
