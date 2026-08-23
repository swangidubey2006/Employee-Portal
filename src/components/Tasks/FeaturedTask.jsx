import React from 'react';
import { User, Calendar } from 'lucide-react';

const FeaturedTask = ({ taskList = [], onSelectTask }) => {
  const task = taskList.find((item) => !item.isCompleted) || taskList[0];

  if (!task) {
    return (
      <div className="featured-task-section">
        <h3 className="section-title-md">Today's Assigned Work</h3>
        <div className="featured-task-card empty-featured-task">
          <div>
            <h2 className="featured-task-title">No task assigned yet</h2>
            <p className="featured-task-desc">
              Your assigned work will appear here when a manager creates a task for you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="featured-task-section">
      <h3 className="section-title-md">Today's Assigned Work</h3>

      <div className="featured-task-card">
        <div className="featured-task-left">
          <div className="featured-badge-row">
            <span className="badge-high-priority-pill">
              {(task.priority || task.tag || 'STANDARD').toUpperCase()}
            </span>
            <span className="featured-task-id">ID: {task.id}</span>
          </div>

          <h2 className="featured-task-title">{task.title}</h2>
          <p className="featured-task-desc">{task.description || 'No description provided.'}</p>

          <div className="featured-meta-row">
            <div className="meta-item">
              <User size={15} className="meta-icon" />
              <span>{task.assignedTo || task.assignedRole || 'Manager'}</span>
            </div>

            <div className="meta-item">
              <Calendar size={15} className="meta-icon" />
              <span>{task.dueDate}</span>
            </div>
          </div>
        </div>

        <button className="btn-view-details" onClick={() => onSelectTask(task)}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default FeaturedTask;
