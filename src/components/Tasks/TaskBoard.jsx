import React from 'react';
import TaskCard from './TaskCard.jsx';

const TaskBoard = ({ taskList, onSelectTask, onUpdateStatus }) => {
  // Group tasks into columns
  const todoTasks = taskList.filter((t) => t.status === 'TO DO');
  const inProgressTasks = taskList.filter((t) => t.status === 'IN PROGRESS');
  const reviewTasks = taskList.filter((t) => t.status === 'REVIEW');
  const completedTasks = taskList.filter((t) => t.status === 'COMPLETED');

  return (
    <div className="task-board-grid">
      {/* Column 1: TO DO */}
      <div className="task-column">
        <div className="column-header">
          <div className="col-title-group">
            <span className="col-dot dot-slate" />
            <h4 className="column-name">TO DO</h4>
          </div>
          <span className="col-count-badge badge-count-slate">{todoTasks.length}</span>
        </div>

        <div className="column-cards-wrapper">
          {todoTasks.map((task) => (
            <TaskCard key={task.id} task={task} onSelectTask={onSelectTask} onUpdateStatus={onUpdateStatus} />
          ))}
        </div>
      </div>

      {/* Column 2: IN PROGRESS */}
      <div className="task-column">
        <div className="column-header">
          <div className="col-title-group">
            <span className="col-dot dot-green" />
            <h4 className="column-name">IN PROGRESS</h4>
          </div>
          <span className="col-count-badge badge-count-green">{inProgressTasks.length}</span>
        </div>

        <div className="column-cards-wrapper">
          {inProgressTasks.map((task) => (
            <TaskCard key={task.id} task={task} onSelectTask={onSelectTask} onUpdateStatus={onUpdateStatus} />
          ))}
        </div>
      </div>

      {/* Column 3: REVIEW */}
      <div className="task-column">
        <div className="column-header">
          <div className="col-title-group">
            <span className="col-dot dot-orange" />
            <h4 className="column-name">REVIEW</h4>
          </div>
          <span className="col-count-badge badge-count-orange">{reviewTasks.length}</span>
        </div>

        <div className="column-cards-wrapper">
          {reviewTasks.map((task) => (
            <TaskCard key={task.id} task={task} onSelectTask={onSelectTask} onUpdateStatus={onUpdateStatus} />
          ))}
        </div>
      </div>

      {/* Column 4: COMPLETED */}
      <div className="task-column">
        <div className="column-header">
          <div className="col-title-group">
            <span className="col-dot dot-emerald" />
            <h4 className="column-name">COMPLETED</h4>
          </div>
          <span className="col-count-badge badge-count-emerald">{completedTasks.length}</span>
        </div>

        <div className="column-cards-wrapper">
          {completedTasks.map((task) => (
            <TaskCard key={task.id} task={task} onSelectTask={onSelectTask} onUpdateStatus={onUpdateStatus} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;
