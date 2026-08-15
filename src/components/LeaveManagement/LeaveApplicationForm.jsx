import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

const LeaveApplicationForm = ({ onSubmitRequest, setToastMessage }) => {
  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleReset = () => {
    setLeaveType('Annual Leave');
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startDate || !endDate || !reason.trim()) {
      setToastMessage('Please fill out all required form fields.');
      return;
    }

    // Calculate days difference
    const start = new Date(startDate);
    const end = new Date(endDate);
    let diffDays = 1;
    if (!isNaN(start) && !isNaN(end) && end >= start) {
      const diffTime = Math.abs(end - start);
      diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    // Format dates string e.g. Aug 15 - Aug 18
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formatShortDate = (dateObj) => {
      if (isNaN(dateObj)) return 'Today';
      return `${monthNames[dateObj.getMonth()]} ${dateObj.getDate() < 10 ? '0' : ''}${dateObj.getDate()}`;
    };

    const formattedDates = `${formatShortDate(start)} - ${formatShortDate(end)}`;
    const appliedOn = `${monthNames[new Date().getMonth()]} ${new Date().getDate() < 10 ? '0' : ''}${new Date().getDate()}, ${new Date().getFullYear()}`;

    const newRequest = {
      id: `#LR-${Math.floor(1000 + Math.random() * 9000)}`,
      leaveType,
      dates: formattedDates,
      days: `${diffDays} Day${diffDays > 1 ? 's' : ''}`,
      appliedOn,
      status: 'Pending',
    };

    onSubmitRequest(newRequest);
    setToastMessage('Leave request submitted successfully.');
    handleReset();
  };

  return (
    <div className="leave-card-box">
      <div className="leave-card-header">
        <h3 className="card-section-title">Apply for Leave</h3>
        <span className="badge-new-request">NEW REQUEST</span>
      </div>

      <form onSubmit={handleSubmit} className="leave-form-container">
        <div className="three-col-input-grid">
          {/* Leave Type Dropdown */}
          <div className="leave-input-group">
            <label className="input-label-sm">Leave Type</label>
            <div className="select-input-wrapper">
              <select
                className="leave-custom-select"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
              >
                <option value="Annual Leave">Annual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
              </select>
              <ChevronDown size={15} className="select-dropdown-icon" />
            </div>
          </div>

          {/* Start Date Input */}
          <div className="leave-input-group">
            <label className="input-label-sm">Start Date</label>
            <div className="date-input-wrapper">
              <input
                type="date"
                className="leave-custom-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <CalendarIcon size={15} className="date-picker-icon" />
            </div>
          </div>

          {/* End Date Input */}
          <div className="leave-input-group">
            <label className="input-label-sm">End Date</label>
            <div className="date-input-wrapper">
              <input
                type="date"
                className="leave-custom-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
              <CalendarIcon size={15} className="date-picker-icon" />
            </div>
          </div>
        </div>

        {/* Reason Textarea */}
        <div className="leave-input-group margin-top-sm">
          <label className="input-label-sm">Reason for Leave</label>
          <textarea
            className="leave-custom-textarea"
            rows="3"
            placeholder="Provide a brief explanation..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="leave-form-actions">
          <button
            type="button"
            className="btn-action-cancel"
            onClick={handleReset}
          >
            Cancel
          </button>
          <button type="submit" className="btn-action-save">
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveApplicationForm;
