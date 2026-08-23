import React from 'react';
import { Users, Building2, CheckCircle2, UserPlus } from 'lucide-react';

const EmployeeSummaryCards = ({ totalEmployeesCount = 42 }) => {
  return (
    <div className="emp-summary-grid">
      {/* 1. TOTAL EMPLOYEES */}
      <div className="emp-summary-card">
        <div className="emp-card-left">
          <span className="emp-summary-label">TOTAL EMPLOYEES</span>
          <span className="emp-summary-val">{totalEmployeesCount}</span>
        </div>
        <div className="emp-card-icon-box icon-box-slate">
          <Users size={20} color="#334155" />
        </div>
      </div>

      {/* 2. DEPARTMENTS */}
      <div className="emp-summary-card">
        <div className="emp-card-left">
          <span className="emp-summary-label">DEPARTMENTS</span>
          <span className="emp-summary-val">05</span>
        </div>
        <div className="emp-card-icon-box icon-box-emerald">
          <Building2 size={20} color="#059669" />
        </div>
      </div>

      {/* 3. AVAILABLE TODAY */}
      <div className="emp-summary-card">
        <div className="emp-card-left">
          <span className="emp-summary-label">AVAILABLE TODAY</span>
          <span className="emp-summary-val">36</span>
        </div>
        <div className="emp-card-icon-box icon-box-mint">
          <CheckCircle2 size={20} color="#10B981" />
        </div>
      </div>

      {/* 4. NEW JOINERS */}
      <div className="emp-summary-card">
        <div className="emp-card-left">
          <span className="emp-summary-label">NEW JOINERS</span>
          <span className="emp-summary-val">02</span>
        </div>
        <div className="emp-card-icon-box icon-box-coral">
          <UserPlus size={20} color="#DC2626" />
        </div>
      </div>
    </div>
  );
};

export default EmployeeSummaryCards;
