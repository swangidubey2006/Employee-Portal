import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Plane, FileText, TrendingUp, AlertCircle, X, ArrowRight } from 'lucide-react';
import { attendanceApi, taskApi } from '../../services/api.js';
import { useNavigate } from 'react-router-dom';

const SummaryCards = () => {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    Promise.all([attendanceApi.getAttendance(), taskApi.getTasks()])
      .then(([attendanceRes, taskRes]) => {
        if (!mounted) return;
        setAttendance(attendanceRes?.data || null);
        setTasks(Array.isArray(taskRes?.data) ? taskRes.data : []);
      })
      .catch((error) => {
        console.error('Dashboard summary load failed:', error);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const attendancePercent = attendance?.stats?.attendancePercentage || '0%';
  const pendingTasks = tasks.filter((task) => task.status !== 'COMPLETED' && !task.isCompleted);
  const dueTodayOrOverdue = pendingTasks.filter((task) => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return !Number.isNaN(due.getTime()) && due <= today;
  }).length;

  const workingHours = attendance?.todayRecord?.workingHours || '00h 00m';

  return (
    <>
      <div className="summary-cards-grid">
        <button type="button" className="summary-card summary-card-clickable" onClick={() => setOpen('attendance')}>
          <div className="summary-card-header">
            <div className="summary-icon-circle icon-bg-green">
              <CheckCircle2 size={18} color="#059669" />
            </div>
            <span className="badge-on-time">{attendance?.todayRecord?.status === 'Present' ? 'Present' : 'Today'}</span>
          </div>
          <div className="summary-card-body">
            <span className="summary-card-label">ATTENDANCE</span>
            <h3 className="summary-card-val">{attendancePercent}</h3>
          </div>
          <div className="summary-card-footer color-green">
            <TrendingUp size={13} />
            <span>{attendance?.stats?.presentDays || 0} present day(s)</span>
          </div>
        </button>

        <div className="summary-card">
          <div className="summary-card-header">
            <div className="summary-icon-circle icon-bg-slate">
              <Clock size={18} color="#475569" />
            </div>
          </div>
          <div className="summary-card-body">
            <span className="summary-card-label">WORKING HOURS</span>
            <h3 className="summary-card-val">{workingHours}</h3>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: workingHours === '00h 00m' ? '0%' : '75%' }} />
            </div>
          </div>
          <div className="summary-card-footer color-muted">
            <span>Today's recorded hours</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-header">
            <div className="summary-icon-circle icon-bg-blue">
              <Plane size={18} color="#2563EB" />
            </div>
          </div>
          <div className="summary-card-body">
            <span className="summary-card-label">AVAILABLE LEAVE</span>
            <h3 className="summary-card-val">{attendance?.stats?.availableLeave ?? 0} Days</h3>
          </div>
          <div className="summary-card-footer leave-breakdown">
            <span>Based on current balance</span>
          </div>
        </div>

        <button type="button" className="summary-card summary-card-clickable" onClick={() => setOpen('tasks')}>
          <div className="summary-card-header">
            <div className="summary-icon-circle icon-bg-red">
              <FileText size={18} color="#DC2626" />
            </div>
            <span className="badge-high-priority">{pendingTasks.length > 0 ? 'Pending' : 'Clear'}</span>
          </div>
          <div className="summary-card-body">
            <span className="summary-card-label">PENDING TASKS</span>
            <h3 className="summary-card-val">{loading ? '…' : `${pendingTasks.length} Items`}</h3>
          </div>
          <div className="summary-card-footer color-red">
            <AlertCircle size={13} />
            <span>{dueTodayOrOverdue} due today / overdue</span>
          </div>
        </button>
      </div>

      {open && (
        <div className="summary-detail-backdrop" onClick={() => setOpen(null)}>
          <div className="summary-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="summary-detail-header">
              <div>
                <span className="summary-card-label">{open === 'attendance' ? 'ATTENDANCE OVERVIEW' : 'PENDING WORK'}</span>
                <h3>{open === 'attendance' ? 'Your attendance performance' : 'Tasks that still need attention'}</h3>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setOpen(null)}><X size={18} /></button>
            </div>

            {open === 'attendance' ? (
              <div className="attendance-detail-content">
                <div className="attendance-percent-circle">
                  <strong>{attendancePercent}</strong>
                  <span>of 100%</span>
                </div>
                <div className="attendance-detail-stats">
                  <div><span>Present</span><strong>{attendance?.stats?.presentDays || 0}</strong></div>
                  <div><span>Working days</span><strong>{attendance?.stats?.totalWorkingDays || 0}</strong></div>
                  <div><span>Absent</span><strong>{attendance?.stats?.absentDays || 0}</strong></div>
                </div>
                <div className="summary-progress-large">
                  <div style={{ width: attendancePercent }} />
                </div>
                <p className="summary-detail-note">
                  Attendance percentage is calculated from your actual attendance records in the employee database.
                </p>
                <button type="button" className="summary-detail-action" onClick={() => navigate('/attendance')}>
                  Open Attendance <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="pending-task-detail-list">
                {pendingTasks.length === 0 ? (
                  <div className="summary-empty-state">
                    <CheckCircle2 size={30} />
                    <p>No pending tasks. Great work!</p>
                  </div>
                ) : (
                  pendingTasks.map((task) => (
                    <div className="pending-task-detail-row" key={task._id || task.taskId}>
                      <div>
                        <strong>{task.title}</strong>
                        <span>{task.assignedTo || task.assignedRole || 'Assigned work'} • Due {task.dueDate || 'Not set'}</span>
                      </div>
                      <span className={`pending-status-pill ${String(task.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                        {task.status}
                      </span>
                    </div>
                  ))
                )}
                <button type="button" className="summary-detail-action" onClick={() => navigate('/tasks')}>
                  Open My Tasks <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SummaryCards;
