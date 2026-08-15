import React from 'react';
import { User, Calendar } from 'lucide-react';

const FeaturedTask = ({ onSelectTask }) => {
  const featuredTaskData = {
    id: '#TSK-4092',
    title: 'Upload Class 10 Science Notes',
    description:
      'Finalize the biology section diagrams and upload the complete PDF package for the upcoming semester curriculum revisions.',
    priority: 'HIGH PRIORITY',
    badgeType: 'badge-high-priority',
    assignedTo: 'Sarah Jenkins (Content Manager)',
    dueDate: '28 Feb, 2026',
    status: 'In Progress',
    column: 'Today\'s Work',
  };

  return (
    <div className="featured-task-section">
      <h3 className="section-title-md">Today's Assigned Work</h3>

      <div className="featured-task-card">
        <div className="featured-task-left">
          <div className="featured-badge-row">
            <span className="badge-high-priority-pill">HIGH PRIORITY</span>
            <span className="featured-task-id">ID: #TSK-4092</span>
          </div>

          <h2 className="featured-task-title">Upload Class 10 Science Notes</h2>
          <p className="featured-task-desc">
            Finalize the biology section diagrams and upload the complete PDF package for the upcoming semester curriculum revisions.
          </p>

          <div className="featured-meta-row">
            <div className="meta-item">
              <User size={15} className="meta-icon" />
              <span>Sarah Jenkins (Content Manager)</span>
            </div>

            <div className="meta-item">
              <Calendar size={15} className="meta-icon" />
              <span>28 Feb, 2026</span>
            </div>
          </div>
        </div>

        <button
          className="btn-view-details"
          onClick={() => onSelectTask(featuredTaskData)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default FeaturedTask;
