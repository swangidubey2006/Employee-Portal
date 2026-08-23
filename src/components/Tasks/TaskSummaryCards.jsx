import React from 'react';
import { ClipboardList, RefreshCw, MessageSquare, CheckCircle2 } from 'lucide-react';

const TaskSummaryCards = ({ taskList = [] }) => {
  const counts = {
    assigned: taskList.length,
    progress: taskList.filter((t) => t.status === 'IN PROGRESS').length,
    review: taskList.filter((t) => t.status === 'REVIEW').length,
    completed: taskList.filter((t) => t.status === 'COMPLETED' || t.isCompleted).length,
  };

  return (
    <div className="tasks-summary-grid">
      <div className="task-summary-card">
        <div className="summary-card-top-row">
          <span className="task-card-label">ASSIGNED</span>
          <ClipboardList size={18} className="text-slate-muted" />
        </div>
        <span className="task-card-val text-dark">{String(counts.assigned).padStart(2, '0')}</span>
      </div>

      <div className="task-summary-card">
        <div className="summary-card-top-row">
          <span className="task-card-label">IN PROGRESS</span>
          <RefreshCw size={18} className="text-emerald" />
        </div>
        <span className="task-card-val text-emerald">{String(counts.progress).padStart(2, '0')}</span>
      </div>

      <div className="task-summary-card">
        <div className="summary-card-top-row">
          <span className="task-card-label">UNDER REVIEW</span>
          <MessageSquare size={18} className="text-orange" />
        </div>
        <span className="task-card-val text-orange">{String(counts.review).padStart(2, '0')}</span>
      </div>

      <div className="task-summary-card">
        <div className="summary-card-top-row">
          <span className="task-card-label">COMPLETED</span>
          <CheckCircle2 size={18} className="text-emerald" />
        </div>
        <span className="task-card-val text-emerald">{String(counts.completed).padStart(2, '0')}</span>
      </div>
    </div>
  );
};

export default TaskSummaryCards;
