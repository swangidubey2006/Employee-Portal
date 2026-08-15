import React, { useState } from 'react';
import Sidebar from '../Dashboard/Sidebar.jsx';
import Header from '../Dashboard/Header.jsx';
import NotificationToast from '../LeftPanel/NotificationToast.jsx';
import LeaveSummaryCards from './LeaveSummaryCards.jsx';
import LeaveApplicationForm from './LeaveApplicationForm.jsx';
import LeaveRequestHistory from './LeaveRequestHistory.jsx';
import LeaveCalendar from './LeaveCalendar.jsx';
import UpcomingHolidays from './UpcomingHolidays.jsx';
import NeedHelpCard from './NeedHelpCard.jsx';

const LeaveManagementPage = () => {
  // Toast notification state
  const [toastMessage, setToastMessage] = useState('');

  // Sample history dataset matching reference screenshot
  const [historyList, setHistoryList] = useState([
    {
      id: '#LR-9842',
      leaveType: 'Annual Leave',
      dates: 'Aug 15 - Aug 18',
      days: '4 Days',
      appliedOn: 'Aug 01, 2023',
      status: 'Approved',
    },
    {
      id: '#LR-9910',
      leaveType: 'Sick Leave',
      dates: 'Sep 05 - Sep 06',
      days: '2 Days',
      appliedOn: 'Sep 02, 2023',
      status: 'Pending',
    },
    {
      id: '#LR-9755',
      leaveType: 'Casual Leave',
      dates: 'Jul 10 - Jul 10',
      days: '1 Day',
      appliedOn: 'Jul 05, 2023',
      status: 'Rejected',
    },
  ]);

  // Handler for new submitted leave requests
  const handleNewRequest = (newReq) => {
    setHistoryList([newReq, ...historyList]);
  };

  // Count pending requests dynamically
  const pendingCount = historyList.filter((item) => item.status === 'Pending').length;

  return (
    <div className="dashboard-layout">
      {/* Toast Notification */}
      <NotificationToast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="dashboard-main-content">
        <Header />

        <div className="dashboard-scroll-body leave-page-body">
          {/* Page Top Heading Bar */}
          <div className="leave-page-header">
            <div className="leave-title-group">
              <h2 className="leave-main-title">Leave Management</h2>
              <p className="leave-sub-title">
                Manage your leave requests and track your leave balance in real-time.
              </p>
            </div>
          </div>

          {/* 1. LEAVE SUMMARY CARDS (4 cards horizontally) */}
          <LeaveSummaryCards pendingCount={pendingCount} />

          {/* 2. MAIN TWO-COLUMN LAYOUT */}
          <div className="leave-two-col-grid">
            {/* LEFT COLUMN: Apply for Leave & Request History */}
            <div className="leave-left-column">
              <LeaveApplicationForm
                onSubmitRequest={handleNewRequest}
                setToastMessage={setToastMessage}
              />

              <LeaveRequestHistory historyList={historyList} />
            </div>

            {/* RIGHT COLUMN: Leave Calendar, Upcoming Holidays & Need Help */}
            <div className="leave-right-column">
              <LeaveCalendar />

              <UpcomingHolidays setToastMessage={setToastMessage} />

              <NeedHelpCard setToastMessage={setToastMessage} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeaveManagementPage;
