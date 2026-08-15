import React from 'react';
import { User, Calendar, CheckCircle2 } from 'lucide-react';

const TaskCard = ({ task, onSelectTask }) => {
  const getBadgeClass = (tag) => {
    switch (tag) {
      case 'STANDARD':
        return 'badge-tag-standard';
      case 'HIGH':
        return 'badge-tag-high';
      case 'IN PROGRESS':
        return 'badge-tag-progress';
      case 'PENDING':
        return 'badge-tag-pending';
      case 'DONE':
        return 'badge-tag-done';
      default:
        return 'badge-tag-standard';
    }
  };

  return (
    <div className="task-board-card" onClick={() => onSelectTask(task)}>
      <span className={`task-tag-badge ${getBadgeClass(task.tag)}`}>
        {task.tag}
      </span>

      <h4 className={`task-board-title ${task.isCompleted ? 'line-through-text' : ''}`}>
        {task.title}
      </h4>

      <div className="task-board-meta">
        <div className="task-meta-line">
          <User size={13} className="meta-icon-sm" />
          <span>{task.assignedRole}</span>
        </div>

        <div className="task-meta-line">
          {task.isCompleted ? (
            <CheckCircle2 size={13} className="meta-icon-sm text-emerald" />
          ) : (
            <Calendar size={13} className="meta-icon-sm" />
          )}
          <span>{task.dueDate}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
