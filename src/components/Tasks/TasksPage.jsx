import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Sidebar from '../Dashboard/Sidebar.jsx';
import Header from '../Dashboard/Header.jsx';
import NotificationToast from '../LeftPanel/NotificationToast.jsx';
import TaskSummaryCards from './TaskSummaryCards.jsx';
import FeaturedTask from './FeaturedTask.jsx';
import TaskBoard from './TaskBoard.jsx';
import TaskDetailsModal from './TaskDetailsModal.jsx';
import { taskApi } from '../../services/api.js';

const TasksPage = () => {
  // Modal state for selected task details
  const [selectedTask, setSelectedTask] = useState(null);

  // Search filter state
  const [searchQuery, setSearchQuery] = useState('');

  // Toast notification state
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Task list loaded from API
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from MongoDB on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await taskApi.getTasks();
      if (res.success && Array.isArray(res.data)) {
        setTaskList(res.data.map((t) => ({
          id: t.taskId || t._id,
          _id: t._id,
          tag: t.tag || 'STANDARD',
          title: t.title,
          assignedRole: t.assignedRole || 'Team',
          assignedTo: t.assignedTo || '',
          dueDate: t.dueDate,
          status: t.status,
          priority: t.priority || 'Standard',
          description: t.description || '',
          isCompleted: t.isCompleted || false,
        })));
      } else {
        setTaskList([]);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setTaskList([]);
      setToastType('error');
      setToastMessage(err.message || 'Unable to load your tasks.');
    } finally {
      setLoading(false);
    }
  };

  // Update task status via API
  const handleUpdateStatus = async (task, newStatus) => {
    if (!task._id) return; // Fallback data - no API call
    try {
      const statusTagMap = {
        'TO DO': 'STANDARD',
        'IN PROGRESS': 'IN PROGRESS',
        'REVIEW': 'PENDING',
        'COMPLETED': 'DONE',
      };
      await taskApi.updateTaskStatus(task._id, {
        status: newStatus,
        tag: statusTagMap[newStatus] || 'STANDARD',
        isCompleted: newStatus === 'COMPLETED',
      });
      const updatedTask = {
        ...task,
        status: newStatus,
        tag: statusTagMap[newStatus] || task.tag,
        isCompleted: newStatus === 'COMPLETED',
      };

      setTaskList((prev) =>
        prev.map((t) => (t._id === task._id ? updatedTask : t))
      );
      setSelectedTask((current) =>
        current?._id === task._id ? updatedTask : current
      );
      setToastType('success');
      setToastMessage(`Task moved to ${newStatus}.`);
    } catch (err) {
      setToastType('error');
      setToastMessage(err.message || 'Failed to update task status.');
    }
  };

  // Filter tasks dynamically
  const filteredTasks = taskList.filter((task) => {
    const query = searchQuery.toLowerCase().trim();
    const searchable = [
      task.title,
      task.description,
      task.assignedRole,
      task.assignedTo,
      task.tag,
      task.status,
      task.priority,
      task.dueDate,
      task.id,
    ].map((value) => String(value ?? '').toLowerCase());

    return searchable.some((value) => value.includes(query));
  });

  return (
    <div className="dashboard-layout">
      {/* Toast Notification */}
      <NotificationToast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="dashboard-main-content">
        <Header />

        <div className="dashboard-scroll-body tasks-page-body">
          {/* Page Top Heading Bar */}
          <div className="tasks-page-header">
            <div className="tasks-title-group">
              <h2 className="tasks-main-title">My Tasks</h2>
              <p className="tasks-sub-title">Track and manage your assigned work.</p>
            </div>
          </div>

          {/* 1. SUMMARY CARDS */}
          <TaskSummaryCards taskList={taskList} />

          {/* 2. TODAY'S ASSIGNED WORK (FEATURED TASK) */}
          <FeaturedTask
            taskList={taskList}
            onSelectTask={(task) => setSelectedTask(task)}
          />

          {/* Search tasks by title or manager */}
          <div className="task-search-bar">
            <div className="task-search-input-wrap">
              <Search size={16} />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search task name or manager..."
                aria-label="Search task name or manager"
              />
            </div>
            <span className="task-search-result-count">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {/* 3. TASK BOARD (KANBAN COLUMNS) */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>Loading tasks...</div>
          ) : (
            <TaskBoard
              taskList={filteredTasks}
              onSelectTask={(task) => setSelectedTask(task)}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
        </div>
      </main>

      {/* TASK DETAILS MODAL DIALOG */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default TasksPage;
