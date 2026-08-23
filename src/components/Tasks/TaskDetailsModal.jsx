import React from 'react';
import { X, User, Calendar, CheckCircle2 } from 'lucide-react';

const STATUSES = ['TO DO', 'IN PROGRESS', 'REVIEW', 'COMPLETED'];

const TaskDetailsModal = ({ task, onClose, onUpdateStatus }) => {
  if (!task) return null;

  const changeStatus = (status) => {
    if (status !== task.status && onUpdateStatus) onUpdateStatus(task, status);
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-content-card modal-task-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-task-title-group">
            <span className="modal-task-id">{task.id || '#TSK-1001'}</span>
            <h3 className="modal-title margin-top-xs">{task.title}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        <div className="modal-task-body">
          <div className="task-status-picker">
            <span className="detail-label">Update status</span>
            <div className="task-status-options">
              {STATUSES.map((status) => (
                <button
                  type="button"
                  key={status}
                  className={`task-status-option ${task.status === status ? 'selected' : ''}`}
                  onClick={() => changeStatus(status)}
                >
                  <span className="task-status-check">{task.status === status ? <CheckCircle2 size={15} /> : '○'}</span>
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-detail-row">
            <span className="detail-label">Priority:</span>
            <span className="badge-high-priority-pill">{task.priority || task.tag}</span>
          </div>
          <div className="modal-detail-row">
            <span className="detail-label">Assigned To:</span>
            <div className="detail-val-icon"><User size={15} /><span>{task.assignedTo || task.assignedRole}</span></div>
          </div>
          <div className="modal-detail-row">
            <span className="detail-label">Due Date:</span>
            <div className="detail-val-icon"><Calendar size={15} /><span>{task.dueDate}</span></div>
          </div>
          <div className="modal-desc-box">
            <span className="desc-box-label">Description:</span>
            <p className="desc-box-text">{task.description || 'No description provided.'}</p>
          </div>
        </div>

        <div className="modal-footer-row">
          <button className="btn-action-cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
