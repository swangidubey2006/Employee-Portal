import React, { useEffect, useState } from 'react';
import { Megaphone, Send, UserPlus, ClipboardList, CalendarPlus, Trash2 } from 'lucide-react';
import Sidebar from './Dashboard/Sidebar.jsx';
import Header from './Dashboard/Header.jsx';
import NotificationToast from './LeftPanel/NotificationToast.jsx';
import { adminApi, announcementApi, taskApi, holidayApi } from '../services/api.js';

const AdminManagementPage = () => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const canManage = ['HR', 'Admin'].includes(currentUser.role);

  const [users, setUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [toast, setToast] = useState('');
  const [announcementForm, setAnnouncementForm] = useState({ title: '', message: '', tag: 'GENERAL' });
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'Standard', assignedUserId: '', dueDate: '' });
  const [busy, setBusy] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [holidayForm, setHolidayForm] = useState({ name: '', date: '', description: '' });

  const load = async () => {
    try {
      const [u, a, h] = await Promise.all([adminApi.getUsers(), announcementApi.getAnnouncements(), holidayApi.getHolidays()]);
      setUsers(Array.isArray(u?.data) ? u.data : []);
      setAnnouncements(Array.isArray(a?.data) ? a.data : []);
      setHolidays(Array.isArray(h?.data) ? h.data : []);
      if (!taskForm.assignedUserId && u?.data?.length) {
        const employee = u.data.find((x) => !['Admin', 'HR'].includes(x.role)) || u.data[0];
        setTaskForm((prev) => ({ ...prev, assignedUserId: employee?._id || '' }));
      }
    } catch (e) {
      setToast(e.message || 'Unable to load admin data.');
    }
  };

  useEffect(() => { if (canManage) load(); }, []);

  if (!canManage) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main-content"><Header /><div className="dashboard-scroll-body">
          <div className="admin-access-denied"><h2>Admin access required</h2><p>This area is available only to HR/Admin users.</p></div>
        </div></main>
      </div>
    );
  }

  const publishAnnouncement = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await announcementApi.createAnnouncement(announcementForm);
      setAnnouncementForm({ title: '', message: '', tag: 'GENERAL' });
      setToast('Announcement published successfully.');
      await load();
    } catch (e) { setToast(e.message || 'Failed to publish announcement.'); }
    finally { setBusy(false); }
  };

  const addHoliday = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await holidayApi.createHoliday(holidayForm);
      setHolidayForm({ name: '', date: '', description: '' });
      setToast('Holiday added successfully.');
      await load();
    } catch (e) {
      setToast(e.message || 'Failed to add holiday.');
    } finally {
      setBusy(false);
    }
  };

  const removeHoliday = async (id) => {
    setBusy(true);
    try {
      await holidayApi.removeHoliday(id);
      setToast('Holiday removed successfully.');
      await load();
    } catch (e) {
      setToast(e.message || 'Failed to remove holiday.');
    } finally {
      setBusy(false);
    }
  };

  const assignTask = async (e) => {
    e.preventDefault();
    const user = users.find((u) => u._id === taskForm.assignedUserId);
    if (!user) return setToast('Please select an employee.');
    setBusy(true);
    try {
      await taskApi.createTask({
        ...taskForm,
        assignedTo: user.fullName,
        assignedRole: user.designation || user.department || 'Employee',
      });
      setTaskForm({ title: '', description: '', priority: 'Standard', assignedUserId: user._id, dueDate: '' });
      setToast(`Task assigned to ${user.fullName}.`);
    } catch (e) { setToast(e.message || 'Failed to assign task.'); }
    finally { setBusy(false); }
  };

  return (
    <div className="dashboard-layout">
      <NotificationToast message={toast} onClose={() => setToast('')} />
      <Sidebar />
      <main className="dashboard-main-content">
        <Header />
        <div className="dashboard-scroll-body admin-page-body">
          <div className="admin-page-heading">
            <div><h2>Admin Control Center</h2><p>Publish announcements and assign work to employees.</p></div>
          </div>

          <div className="admin-two-col">
            <form className="admin-panel" onSubmit={publishAnnouncement}>
              <div className="admin-panel-title"><Megaphone size={18} /><span>Create Announcement</span></div>
              <label>Tag<input value={announcementForm.tag} onChange={(e) => setAnnouncementForm({ ...announcementForm, tag: e.target.value })} placeholder="GENERAL / POLICY / EVENT" /></label>
              <label>Title<input required value={announcementForm.title} onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })} placeholder="Announcement title" /></label>
              <label>Message<textarea required rows="6" value={announcementForm.message} onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })} placeholder="Write the announcement..." /></label>
              <button className="btn-admin-primary" disabled={busy}><Send size={15} /> Publish Announcement</button>
            </form>

            <form className="admin-panel" onSubmit={assignTask}>
              <div className="admin-panel-title"><ClipboardList size={18} /><span>Assign Work</span></div>
              <label>Employee<select required value={taskForm.assignedUserId} onChange={(e) => setTaskForm({ ...taskForm, assignedUserId: e.target.value })}>
                <option value="">Select employee</option>
                {users.map((u) => <option key={u._id} value={u._id}>{u.fullName} — {u.email}</option>)}
              </select></label>
              <label>Task Title<input required value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Task title" /></label>
              <label>Description<textarea rows="4" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="Describe the work..." /></label>
              <div className="admin-form-row">
                <label>Priority<select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}><option>Standard</option><option>High</option><option>Low</option></select></label>
                <label>Due Date<input type="date" required value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} /></label>
              </div>
              <button className="btn-admin-primary" disabled={busy}><UserPlus size={15} /> Assign Task</button>
            </form>
          </div>

          <div className="admin-two-col">
            <form className="admin-panel" onSubmit={addHoliday}>
              <div className="admin-panel-title"><CalendarPlus size={18} /><span>Manage Holidays</span></div>
              <label>Holiday Name<input required value={holidayForm.name} onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })} placeholder="Holiday name" /></label>
              <label>Date<input required type="date" value={holidayForm.date} onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })} /></label>
              <label>Description<textarea rows="3" value={holidayForm.description} onChange={(e) => setHolidayForm({ ...holidayForm, description: e.target.value })} placeholder="Optional description" /></label>
              <button className="btn-admin-primary" disabled={busy}><CalendarPlus size={15} /> Add Holiday</button>
            </form>

            <div className="admin-panel">
              <div className="admin-panel-title"><CalendarPlus size={18} /><span>Upcoming Holiday Records</span></div>
              {holidays.length === 0 ? <p className="admin-muted">No upcoming holidays.</p> : holidays.slice(0, 8).map((h) => (
                <div className="admin-announcement-row" key={h._id}>
                  <div>
                    <strong>{h.name}</strong>
                    <p>{new Date(h.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <button type="button" className="icon-action-btn" onClick={() => removeHoliday(h._id)} disabled={busy} aria-label={`Remove ${h.name}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-panel admin-announcement-history">
            <div className="admin-panel-title"><Megaphone size={18} /><span>Published Announcements</span></div>
            {announcements.length === 0 ? <p className="admin-muted">No announcements published yet.</p> : announcements.map((a) => (
              <div className="admin-announcement-row" key={a._id}>
                <div><strong>{a.title}</strong><p>{a.message}</p><small>{a.tag} · {a.publishedByName || 'Admin'} · {new Date(a.createdAt).toLocaleString()}</small></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminManagementPage;
