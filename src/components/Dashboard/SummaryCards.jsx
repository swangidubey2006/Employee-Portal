import React from 'react';
import { CheckCircle2, Clock, Plane, FileText, TrendingUp, AlertCircle } from 'lucide-react';

const SummaryCards = () => {
  return (
    <div className="summary-cards-grid">
      {/* CARD 1: ATTENDANCE */}
      <div className="summary-card">
        <div className="summary-card-header">
          <div className="summary-icon-circle icon-bg-green">
            <CheckCircle2 size={18} color="#059669" />
          </div>
          <span className="badge-on-time">On Time</span>
        </div>
        <div className="summary-card-body">
          <span className="summary-card-label">ATTENDANCE</span>
          <h3 className="summary-card-val">Present Today</h3>
        </div>
        <div className="summary-card-footer color-green">
          <TrendingUp size={13} />
          <span>+100% Monthly Avg</span>
        </div>
      </div>

      {/* CARD 2: WORKING HOURS */}
      <div className="summary-card">
        <div className="summary-card-header">
          <div className="summary-icon-circle icon-bg-slate">
            <Clock size={18} color="#475569" />
          </div>
        </div>
        <div className="summary-card-body">
          <span className="summary-card-label">WORKING HOURS</span>
          <h3 className="summary-card-val">06h 45m</h3>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: '75%' }} />
          </div>
        </div>
        <div className="summary-card-footer color-muted">
          <span>2h 15m remaining</span>
        </div>
      </div>

      {/* CARD 3: AVAILABLE LEAVE */}
      <div className="summary-card">
        <div className="summary-card-header">
          <div className="summary-icon-circle icon-bg-blue">
            <Plane size={18} color="#2563EB" />
          </div>
        </div>
        <div className="summary-card-body">
          <span className="summary-card-label">AVAILABLE LEAVE</span>
          <h3 className="summary-card-val">12 Days</h3>
        </div>
        <div className="summary-card-footer leave-breakdown">
          <span><strong>04</strong> SICK</span>
          <span className="v-line" />
          <span><strong>08</strong> CASUAL</span>
        </div>
      </div>

      {/* CARD 4: PENDING TASKS */}
      <div className="summary-card">
        <div className="summary-card-header">
          <div className="summary-icon-circle icon-bg-red">
            <FileText size={18} color="#DC2626" />
          </div>
          <span className="badge-high-priority">High Priority</span>
        </div>
        <div className="summary-card-body">
          <span className="summary-card-label">PENDING TASKS</span>
          <h3 className="summary-card-val">07 Items</h3>
        </div>
        <div className="summary-card-footer color-red">
          <AlertCircle size={13} />
          <span>3 Due by EOD</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
