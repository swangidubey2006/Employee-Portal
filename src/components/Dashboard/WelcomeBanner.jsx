import React, { useState } from 'react';
import { Plus, Download, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { attendanceApi } from '../../services/api.js';

const WelcomeBanner = () => {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const firstName = savedUser.fullName ? savedUser.fullName.split(' ')[0] : 'Employee';

  const getReport = async () => {
    try {
      setDownloading(true);
      const res = await attendanceApi.getAttendance();
      const records = res?.data?.records || [];
      const headers = ['Date','Work Mode','Check In','Check Out','Working Hours','Status'];
      const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
      const rows = records.map(r => [r.date, r.workMode, r.checkInTime, r.checkOutTime, r.workingHours, r.status].map(escape).join(','));
      const csv = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `GYANYUG_Attendance_Report_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    } catch (error) {
      window.alert(error.message || 'Unable to generate report. Please try again.');
    } finally { setDownloading(false); }
  };

  return (
    <div className="welcome-banner-container">
      <div className="welcome-banner-text">
        <h2 className="banner-greeting">Good Morning, {firstName} 👋</h2>
        <p className="banner-subtext">Welcome back to GYANYUG Employee Portal. Have a productive day.</p>
      </div>
      <div className="welcome-banner-actions">
        <button type="button" className="btn-action-dark" onClick={() => navigate('/leave-management')}>
          <Plus size={15} /><span>Apply Leave</span>
        </button>
        <button type="button" className="btn-action-light" onClick={getReport} disabled={downloading}>
          {downloading ? <Loader2 size={15} className="spin" /> : <Download size={15} />}
          <span>{downloading ? 'Preparing...' : 'Get Report'}</span>
        </button>
      </div>
    </div>
  );
};
export default WelcomeBanner;
