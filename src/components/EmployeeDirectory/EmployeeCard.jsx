import React from 'react';
import { Mail } from 'lucide-react';

const EmployeeCard = ({ employee, onViewDetails }) => {
  return (
    <div className="emp-card-item">
      {/* Centered Circular Avatar with Status Dot */}
      <div className="emp-avatar-wrapper">
        <img
          src={employee.avatar}
          alt={employee.name}
          className="emp-avatar-img"
          onError={(e) => {
            // Fallback avatar image generator if image URL fails
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              employee.name
            )}&background=0F172A&color=fff`;
          }}
        />
        <span
          className={`emp-status-dot ${
            employee.status === 'Active' ? 'dot-online' : 'dot-away'
          }`}
          title={employee.status}
        />
      </div>

      {/* Name & Designation */}
      <div className="emp-info-header">
        <h4 className="emp-name-text">{employee.name}</h4>
        <span className="emp-designation-text">{employee.designation}</span>
      </div>

      {/* Department & Email Metadata */}
      <div className="emp-card-meta-list">
        <div className="emp-meta-row">
          <span className="meta-label">Department</span>
          <span className="meta-val-bold">{employee.department}</span>
        </div>

        <div className="emp-meta-email-row">
          <Mail size={13} className="email-icon" />
          <span className="email-val-text" title={employee.email}>
            {employee.email}
          </span>
        </div>
      </div>

      {/* View Details Button */}
      <button
        className="btn-emp-view-details"
        onClick={() => onViewDetails(employee)}
      >
        View Details
      </button>
    </div>
  );
};

export default EmployeeCard;
