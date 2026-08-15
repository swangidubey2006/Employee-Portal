import React from 'react';
import { X, User, Calendar, Tag, CheckCircle2, Clock } from 'lucide-react';

const TaskDetailsModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-content-card modal-task-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-task-title-group">
            <span className="modal-task-id">{task.id || '#TSK-1001'}</span>
            <h3 className="modal-title margin-top-xs">{task.title}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-task-body">
          <div className="modal-detail-row">
            <span className="detail-label">Priority:</span>
            <span className="badge-high-priority-pill">{task.priority || task.tag}</span>
          </div>

          <div className="modal-detail-row">
            <span className="detail-label">Status:</span>
            <span className="badge-status-dark">{task.status}</span>
          </div>

          <div className="modal-detail-row">
            <span className="detail-label">Assigned To:</span>
            <div className="detail-val-icon">
              <User size={15} color="#475569" />
              <span>{task.assignedTo || task.assignedRole}</span>
            </div>
          </div>

          <div className="modal-detail-row">
            <span className="detail-label">Due Date:</span>
            <div className="detail-val-icon">
              <Calendar size={15} color="#475569" />
              <span>{task.dueDate}</span>
            </div>
          </div>

          <div className="modal-desc-box">
            <span className="desc-box-label">Description:</span>
            <p className="desc-box-text">
              {task.description ||
                'Complete all required deliverables and review the content formatting before publishing.'}
            </p>
          </div>
        </div>

        <div className="modal-footer-row">
          <button className="btn-action-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
