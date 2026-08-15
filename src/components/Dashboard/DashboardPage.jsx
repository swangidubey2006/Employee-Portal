import React from 'react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import WelcomeBanner from './WelcomeBanner.jsx';
import SummaryCards from './SummaryCards.jsx';
import AttendanceAnalytics from './AttendanceAnalytics.jsx';
import CalendarCard from './CalendarCard.jsx';
import TasksCard from './TasksCard.jsx';
import AnnouncementsCard from './AnnouncementsCard.jsx';
import HolidaysCard from './HolidaysCard.jsx';

const DashboardPage = () => {
  return (
    <div className="dashboard-layout">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="dashboard-main-content">
        {/* Top Search & User Header */}
        <Header />

        <div className="dashboard-scroll-body">
          {/* Welcome Banner */}
          <WelcomeBanner />

          {/* Top 4 Summary Cards */}
          <SummaryCards />

          {/* Analytics & Calendar Grid */}
          <div className="two-col-grid margin-top-grid">
            <AttendanceAnalytics />
            <CalendarCard />
          </div>

          {/* Tasks & Announcements Grid */}
          <div className="two-col-grid margin-top-grid">
            <TasksCard />
            <AnnouncementsCard />
          </div>

          {/* Upcoming Holidays Section */}
          <HolidaysCard />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
