import React from 'react';
import { User, Calendar, CheckCircle2 } from 'lucide-react';

const TaskCard = ({ task, onSelectTask, onUpdateStatus }) => {
  const getBadgeClass = (tag) => {
    switch (tag) {
      case 'STANDARD': return 'badge-tag-standard';
      case 'HIGH': return 'badge-tag-high';
      case 'IN PROGRESS': return 'badge-tag-progress';
      case 'PENDING': return 'badge-tag-pending';
      case 'DONE': return 'badge-tag-done';
      default: return 'badge-tag-standard';
    }
  };

  const isCompleted = task.status === 'COMPLETED' || task.isCompleted;

  const handleComplete = (event) => {
    event.stopPropagation();
    if (!isCompleted && onUpdateStatus) {
      onUpdateStatus(task, 'COMPLETED');
    }
  };

  return (
    <div className={`task-board-card ${isCompleted ? 'task-completed-card' : ''}`} onClick={() => onSelectTask(task)}>
      <div className="task-card-topline">
        <span className={`task-tag-badge ${getBadgeClass(task.tag)}`}>
          {task.tag}
        </span>

        <button
          type="button"
          className={`task-complete-btn ${isCompleted ? 'is-completed' : ''}`}
          onClick={handleComplete}
          title={isCompleted ? 'Completed' : 'Mark task as complete'}
          aria-label={isCompleted ? 'Completed' : 'Mark task as complete'}
        >
          <CheckCircle2 size={18} />
        </button>
      </div>

      <h4 className={`task-board-title ${isCompleted ? 'line-through-text' : ''}`}>
        {task.title}
      </h4>

      <div className="task-board-meta">
        <div className="task-meta-line">
          <User size={13} className="meta-icon-sm" />
          <span>{task.assignedRole}</span>
        </div>

        <div className="task-meta-line">
          <Calendar size={13} className="meta-icon-sm" />
          <span>{task.dueDate}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
