import React from 'react';
import { X, Mail, Phone, Calendar, UserCheck, Building2, ShieldCheck } from 'lucide-react';

const EmployeeDetailsModal = ({ employee, onClose }) => {
  if (!employee) return null;

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-content-card modal-emp-details-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Employee Details</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-emp-body">
          {/* Avatar Hero Row */}
          <div className="modal-emp-hero">
            <div className="modal-emp-avatar-wrapper">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="modal-emp-avatar-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    employee.name
                  )}&background=0F172A&color=fff`;
                }}
              />
              <span
                className={`modal-status-badge ${
                  employee.status === 'Active' ? 'status-active' : 'status-away'
                }`}
              >
                ● {employee.status}
              </span>
            </div>

            <div className="modal-emp-hero-info">
              <h3 className="modal-emp-name">{employee.name}</h3>
              <p className="modal-emp-designation">{employee.designation}</p>
              <span className="modal-emp-dept-pill">{employee.department} Department</span>
            </div>
          </div>

          <div className="modal-divider-line" />

          {/* Detailed Info Grid */}
          <div className="modal-info-grid">
            <div className="info-grid-item">
              <span className="grid-item-label">
                <Mail size={13} className="inline-icon" /> Email Address
              </span>
              <span className="grid-item-val">{employee.email}</span>
            </div>

            <div className="info-grid-item">
              <span className="grid-item-label">
                <Phone size={13} className="inline-icon" /> Phone Number
              </span>
              <span className="grid-item-val">{employee.phone || '+91 98765 43210'}</span>
            </div>

            <div className="info-grid-item">
              <span className="grid-item-label">
                <Calendar size={13} className="inline-icon" /> Joining Date
              </span>
              <span className="grid-item-val">{employee.joiningDate || '15 Jan, 2023'}</span>
            </div>

            <div className="info-grid-item">
              <span className="grid-item-label">
                <UserCheck size={13} className="inline-icon" /> Reporting Manager
              </span>
              <span className="grid-item-val">{employee.reportingManager || 'Alex Rivera (HR Lead)'}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer-row">
          <button className="btn-action-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;
