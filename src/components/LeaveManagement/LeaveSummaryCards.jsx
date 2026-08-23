import React from 'react';
import { Umbrella, PlusSquare, Smile, Clock } from 'lucide-react';

const LeaveSummaryCards = ({ pendingCount = 2 }) => {
  return (
    <div className="leave-summary-grid">
      {/* 1. Annual Leave */}
      <div className="leave-summary-card">
        <div className="summary-card-top-row">
          <div className="summary-card-icon icon-box-slate">
            <Umbrella size={20} color="#475569" />
          </div>
          <span className="summary-card-title">Annual Leave</span>
        </div>
        <div className="summary-card-bottom-row">
          <span className="summary-card-val">10</span>
          <span className="summary-card-sub">Days Remaining</span>
        </div>
      </div>

      {/* 2. Sick Leave */}
      <div className="leave-summary-card">
        <div className="summary-card-top-row">
          <div className="summary-card-icon icon-box-green">
            <PlusSquare size={20} color="#059669" />
          </div>
          <span className="summary-card-title">Sick Leave</span>
        </div>
        <div className="summary-card-bottom-row">
          <span className="summary-card-val text-green">05</span>
          <span className="summary-card-sub">Days Remaining</span>
        </div>
      </div>

      {/* 3. Casual Leave */}
      <div className="leave-summary-card">
        <div className="summary-card-top-row">
          <div className="summary-card-icon icon-box-blue">
            <Smile size={20} color="#2563EB" />
          </div>
          <span className="summary-card-title">Casual Leave</span>
        </div>
        <div className="summary-card-bottom-row">
          <span className="summary-card-val text-blue">03</span>
          <span className="summary-card-sub">Days Remaining</span>
        </div>
      </div>

      {/* 4. Pending Requests */}
      <div className="leave-summary-card">
        <div className="summary-card-top-row">
          <div className="summary-card-icon icon-box-red">
            <Clock size={20} color="#DC2626" />
          </div>
          <span className="summary-card-title">Pending Requests</span>
        </div>
        <div className="summary-card-bottom-row">
          <span className="summary-card-val text-red">
            {pendingCount < 10 ? `0${pendingCount}` : pendingCount}
          </span>
          <span className="summary-card-sub">Awaiting</span>
        </div>
      </div>
    </div>
  );
};

export default LeaveSummaryCards;
