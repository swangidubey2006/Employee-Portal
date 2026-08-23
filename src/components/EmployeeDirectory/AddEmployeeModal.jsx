import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { employeeApi } from '../../services/api.js';

const AddEmployeeModal = ({ onClose, onAddEmployee, setToastMessage }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('IT');
  const [designation, setDesignation] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [reportingManager, setReportingManager] = useState('');
  const [status, setStatus] = useState('Active');

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !designation.trim()) {
      if (setToastMessage) setToastMessage('Please fill out Name, Email and Designation.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await employeeApi.addEmployee({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || '+91 98765 43210',
        department,
        designation: designation.trim(),
        joiningDate: joiningDate || 'Today',
        reportingManager: reportingManager.trim() || 'Alex Rivera',
        status,
      });

      if (!res?.success || !res?.data) {
        throw new Error(res?.message || 'Failed to add employee.');
      }

      onAddEmployee({
        ...res.data,
        id: res.data._id || res.data.id,
      });
      if (setToastMessage) setToastMessage(`Employee ${fullName} added successfully.`);
      onClose();
    } catch (error) {
      if (setToastMessage) setToastMessage(error.message || 'Failed to add employee.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-content-card modal-add-emp-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">+ Add New Employee</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-emp-form">
          <div className="two-col-form-grid">
            <div className="leave-input-group">
              <label className="input-label-sm">Full Name *</label>
              <input
                type="text"
                className="leave-custom-input"
                placeholder="e.g. Ananya Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="leave-input-group">
              <label className="input-label-sm">Email Address *</label>
              <input
                type="email"
                className="leave-custom-input"
                placeholder="e.g. ananya.s@gyanyug.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="leave-input-group">
              <label className="input-label-sm">Department</label>
              <div className="select-input-wrapper">
                <select
                  className="leave-custom-select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="HR">HR</option>
                  <option value="IT">IT</option>
                  <option value="Content">Content</option>
                  <option value="Academic">Academic</option>
                </select>
                <ChevronDown size={15} className="select-dropdown-icon" />
              </div>
            </div>

            <div className="leave-input-group">
              <label className="input-label-sm">Designation *</label>
              <input
                type="text"
                className="leave-custom-input"
                placeholder="e.g. Senior Developer"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
              />
            </div>

            <div className="leave-input-group">
              <label className="input-label-sm">Phone Number</label>
              <input
                type="text"
                className="leave-custom-input"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="leave-input-group">
              <label className="input-label-sm">Joining Date</label>
              <input
                type="date"
                className="leave-custom-input"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
              />
            </div>

            <div className="leave-input-group">
              <label className="input-label-sm">Reporting Manager</label>
              <input
                type="text"
                className="leave-custom-input"
                placeholder="Alex Rivera"
                value={reportingManager}
                onChange={(e) => setReportingManager(e.target.value)}
              />
            </div>

            <div className="leave-input-group">
              <label className="input-label-sm">Status</label>
              <div className="select-input-wrapper">
                <select
                  className="leave-custom-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Away">Away</option>
                </select>
                <ChevronDown size={15} className="select-dropdown-icon" />
              </div>
            </div>
          </div>

          <div className="modal-footer-row margin-top-md">
            <button type="button" className="btn-action-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-action-save" disabled={submitting}>
              {submitting ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
