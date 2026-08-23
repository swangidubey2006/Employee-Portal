import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { taskApi } from '../../services/api.js';

const TasksCard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    taskApi.getTasks()
      .then((res) => {
        if (mounted) setTasks(Array.isArray(res?.data) ? res.data : []);
      })
      .catch((error) => console.error('Dashboard tasks load failed:', error))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const pending = tasks.filter((task) => task.status !== 'COMPLETED' && !task.isCompleted);
  const visible = pending.slice(0, 3);

  return (
    <div className="tasks-card">
      <div className="card-header-row">
        <h3 className="card-section-title">Today's Tasks</h3>
        <button className="link-view-all" type="button" onClick={() => navigate('/tasks')}>
          View All
        </button>
      </div>

      <div className="tasks-list">
        {loading ? (
          <div className="task-empty-message">Loading your tasks...</div>
        ) : visible.length === 0 ? (
          <div className="task-empty-message">
            <CheckCircle2 size={20} />
            <span>No pending tasks. Great work!</span>
          </div>
        ) : (
          visible.map((task) => (
            <button
              key={task._id || task.taskId}
              type="button"
              className="task-item"
              onClick={() => navigate('/tasks')}
            >
              <span className="task-checkbox task-checkbox-static" aria-hidden="true" />
              <div className="task-info">
                <span className="task-title">{task.title}</span>
                <span className="task-sub">Due {task.dueDate || 'Not set'}</span>
              </div>
              <span className={`task-priority-badge badge-p-${String(task.priority || 'standard').toLowerCase()}`}>
                {task.priority || 'Standard'}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default TasksCard;
