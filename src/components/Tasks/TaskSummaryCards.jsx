import React from 'react';
import { ClipboardList, RefreshCw, MessageSquare, CheckCircle2 } from 'lucide-react';

const TaskSummaryCards = () => {
  return (
    <div className="tasks-summary-grid">
      {/* 1. ASSIGNED */}
      <div className="task-summary-card">
        <div className="summary-card-top-row">
          <span className="task-card-label">ASSIGNED</span>
          <ClipboardList size={18} className="text-slate-muted" />
        </div>
        <span className="task-card-val text-dark">08</span>
      </div>

      {/* 2. IN PROGRESS */}
      <div className="task-summary-card">
        <div className="summary-card-top-row">
          <span className="task-card-label">IN PROGRESS</span>
          <RefreshCw size={18} className="text-emerald" />
        </div>
        <span className="task-card-val text-emerald">03</span>
      </div>

      {/* 3. UNDER REVIEW */}
      <div className="task-summary-card">
        <div className="summary-card-top-row">
          <span className="task-card-label">UNDER REVIEW</span>
          <MessageSquare size={18} className="text-orange" />
        </div>
        <span className="task-card-val text-orange">02</span>
      </div>

      {/* 4. COMPLETED */}
      <div className="task-summary-card">
        <div className="summary-card-top-row">
          <span className="task-card-label">COMPLETED</span>
          <CheckCircle2 size={18} className="text-emerald" />
        </div>
        <span className="task-card-val text-emerald">03</span>
      </div>
    </div>
  );
};

export default TaskSummaryCards;
