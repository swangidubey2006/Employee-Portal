import React, { useState } from 'react';

const TasksCard = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Update employee leave policy 2024',
      sub: 'Due by 2:00 PM',
      priority: 'HIGH',
      completed: false,
    },
    {
      id: 2,
      title: 'Review candidate interview scores',
      sub: 'Due by 5:30 PM',
      priority: 'MEDIUM',
      completed: false,
    },
    {
      id: 3,
      title: 'Quarterly feedback synchronization',
      sub: 'Completed',
      priority: 'LOW',
      completed: true,
    },
  ]);

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'badge-p-high';
      case 'MEDIUM':
        return 'badge-p-medium';
      case 'LOW':
        return 'badge-p-low';
      default:
        return '';
    }
  };

  return (
    <div className="tasks-card">
      <div className="card-header-row">
        <h3 className="card-section-title">Today's Tasks</h3>
        <button className="link-view-all">View All</button>
      </div>

      <div className="tasks-list">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-item ${task.completed ? 'completed' : ''}`}
            onClick={() => toggleTask(task.id)}
          >
            <input
              type="checkbox"
              className="task-checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              onClick={(e) => e.stopPropagation()}
            />

            <div className="task-info">
              <span className="task-title">{task.title}</span>
              <span className="task-sub">{task.sub}</span>
            </div>

            <span className={`task-priority-badge ${getPriorityBadgeClass(task.priority)}`}>
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksCard;
