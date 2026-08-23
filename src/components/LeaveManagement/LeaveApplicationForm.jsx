import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { leaveApi } from '../../services/api.js';

const LeaveApplicationForm = ({ onSubmitRequest, setToastMessage }) => {
  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReset = () => {
    setLeaveType('Annual Leave');
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate || !reason.trim()) {
      setToastMessage('Please fill out all required form fields.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      setToastMessage('End date cannot be before start date.');
      return;
    }

    if (submitting) return;

    try {
      setSubmitting(true);
      const res = await leaveApi.applyLeave({ leaveType, startDate, endDate, reason });

      if (res.success) {
        const newRequest = {
          id: res.data.requestId,
          leaveType: res.data.leaveType,
          dates: res.data.dates,
          days: res.data.days,
          appliedOn: res.data.appliedOn,
          status: res.data.status,
        };
        onSubmitRequest(newRequest);
        setToastMessage('Leave request submitted successfully.');
        handleReset();
      }
    } catch (err) {
      setToastMessage(err.message || 'Failed to submit leave request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="leave-card-box">
      <div className="leave-card-header">
        <h3 className="card-section-title">Apply for Leave</h3>
        <span className="badge-new-request">NEW REQUEST</span>
      </div>

      <form onSubmit={handleSubmit} className="leave-form-container">
        {/* Leave Type stays on the first row */}
        <div className="leave-type-row">
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
        </div>

        {/* Dates move to the row below */}
        <div className="two-col-input-grid">
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
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn-action-save" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveApplicationForm;
