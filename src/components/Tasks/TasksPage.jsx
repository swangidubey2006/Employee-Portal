import React, { useState } from 'react';
import Sidebar from '../Dashboard/Sidebar.jsx';
import Header from '../Dashboard/Header.jsx';
import TaskSummaryCards from './TaskSummaryCards.jsx';
import FeaturedTask from './FeaturedTask.jsx';
import TaskBoard from './TaskBoard.jsx';
import TaskDetailsModal from './TaskDetailsModal.jsx';

const TasksPage = () => {
  // Modal state for selected task details
  const [selectedTask, setSelectedTask] = useState(null);

  // Search filter state
  const [searchQuery, setSearchQuery] = useState('');

  // Initial task board dataset matching reference screenshot
  const [taskList] = useState([
    {
      id: '#TSK-1001',
      tag: 'STANDARD',
      title: 'Review Mathematics Quiz',
      assignedRole: 'HOD Maths',
      dueDate: '02 Mar',
      status: 'TO DO',
      priority: 'Standard',
      description: 'Review the newly submitted mathematics quiz questions for Class 10 semester exams.',
      isCompleted: false,
    },
    {
      id: '#TSK-1002',
      tag: 'HIGH',
      title: 'Verify English Grammar Content',
      assignedRole: 'Editor-in-Chief',
      dueDate: '04 Mar',
      status: 'TO DO',
      priority: 'High',
      description: 'Perform final proofreading on the advanced English grammar modules.',
      isCompleted: false,
    },
    {
      id: '#TSK-2001',
      tag: 'IN PROGRESS',
      title: 'Publish Biology Practice Test',
      assignedRole: 'HOD Science',
      dueDate: '01 Mar',
      status: 'IN PROGRESS',
      priority: 'In Progress',
      description: 'Format biology diagrams and publish the semester 2 practice test series.',
      isCompleted: false,
    },
    {
      id: '#TSK-3001',
      tag: 'PENDING',
      title: 'Update Course Materials',
      assignedRole: 'Admin Office',
      dueDate: '28 Feb',
      status: 'REVIEW',
      priority: 'Review Required',
      description: 'Synchronize administrative course material updates across all department portals.',
      isCompleted: false,
    },
    {
      id: '#TSK-4001',
      tag: 'DONE',
      title: 'Maths Level 1 Module',
      assignedRole: 'Sarah Jenkins',
      dueDate: 'Completed',
      status: 'COMPLETED',
      priority: 'Completed',
      description: 'Completed level 1 maths module verification and PDF generation.',
      isCompleted: true,
    },
  ]);

  // Filter tasks dynamically
  const filteredTasks = taskList.filter((task) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      task.title.toLowerCase().includes(query) ||
      task.assignedRole.toLowerCase().includes(query) ||
      task.tag.toLowerCase().includes(query) ||
      task.status.toLowerCase().includes(query)
    );
  });

  return (
    <div className="dashboard-layout">
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
          <TaskSummaryCards />

          {/* 2. TODAY'S ASSIGNED WORK (FEATURED TASK) */}
          <FeaturedTask onSelectTask={(task) => setSelectedTask(task)} />

          {/* 3. TASK BOARD (KANBAN COLUMNS) */}
          <TaskBoard
            taskList={filteredTasks}
            onSelectTask={(task) => setSelectedTask(task)}
          />
        </div>
      </main>

      {/* TASK DETAILS MODAL DIALOG */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default TasksPage;
