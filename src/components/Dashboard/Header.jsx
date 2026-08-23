import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Moon, Sun, Mail, CheckCircle2, Clock, FileText } from 'lucide-react';
import { profileApi, taskApi, employeeApi, announcementApi } from '../../services/api.js';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = savedUser.fullName || 'Shristi Kumari';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState(savedUser.avatarData || '');

  useEffect(() => {
    let mounted = true;
    profileApi.getProfile().then((res) => {
      if (mounted && res?.data?.avatarData) setProfileAvatar(res.data.avatarData);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  // Theme state persisted in localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('employeePortalTheme') || 'light';
  });

  // Apply theme class to document body
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('employeePortalTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchResults([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const [tasks, employees, announcements] = await Promise.all([
          taskApi.getTasks().catch(() => ({ data: [] })),
          employeeApi.getEmployees({ search: query }).catch(() => ({ data: [] })),
          announcementApi.getAnnouncements().catch(() => ({ data: [] })),
        ]);
        if (cancelled) return;
        const results = [];
        (tasks?.data || []).filter(t =>
          [t.title, t.description, t.assignedTo, t.status].some(v => String(v || '').toLowerCase().includes(query))
        ).slice(0, 5).forEach(t => results.push({ key: `task-${t._id}`, type: 'Task', title: t.title, meta: t.status, path: '/tasks' }));
        (employees?.data || []).slice(0, 5).forEach(e => results.push({ key: `emp-${e._id}`, type: 'Employee', title: e.name, meta: e.designation || e.department, path: '/employees' }));
        (announcements?.data || []).filter(a =>
          [a.title, a.message, a.tag].some(v => String(v || '').toLowerCase().includes(query))
        ).slice(0, 5).forEach(a => results.push({ key: `ann-${a._id}`, type: 'Announcement', title: a.title, meta: a.tag, path: '/dashboard' }));
        setSearchResults(results.slice(0, 10));
      } catch (error) {
        console.error('Global search failed:', error);
      }
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [searchQuery]);

  // Notifications dropdown states
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'leave',
      title: 'Leave request update',
      text: 'Your leave request has been updated.',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      type: 'task',
      title: 'Task reminder',
      text: 'You have a task pending for review.',
      time: '5 hours ago',
      unread: true,
    },
    {
      id: 3,
      type: 'document',
      title: 'Document update',
      text: 'A new company document has been added.',
      time: 'Yesterday',
      unread: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'leave':
        return <CheckCircle2 size={16} />;
      case 'task':
        return <Clock size={16} />;
      case 'document':
        return <FileText size={16} />;
      default:
        return <Bell size={16} />;
    }
  };

  return (
    <header className="dashboard-header">
      {/* Search Input */}
      <div className="header-search-wrapper global-search-wrapper">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="header-search-input"
          placeholder="Search tasks, documents, or employees..."
          aria-label="Search"
          value={searchQuery}
          onFocus={() => setSearchOpen(true)}
          onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') { setSearchOpen(false); e.currentTarget.blur(); }
          }}
        />
        {searchOpen && searchQuery.trim() && (
          <div className="global-search-results">
            {searchResults.length === 0 ? (
              <div className="global-search-empty">No results found.</div>
            ) : searchResults.map((result) => (
              <button
                key={result.key}
                type="button"
                className="global-search-result"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { navigate(result.path); setSearchOpen(false); setSearchQuery(''); }}
              >
                <span className="global-search-type">{result.type}</span>
                <span className="global-search-result-title">{result.title}</span>
                <span className="global-search-result-meta">{result.meta}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right User & Utility Group */}
      <div className="header-right-group">
        {/* Notification Icon & Dropdown Container */}
        <div className="notification-dropdown-container" ref={dropdownRef}>
          <button
            className="header-icon-btn"
            title="Notifications"
            aria-label="Notifications"
            aria-expanded={dropdownOpen}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-badge-dot" />}
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="notification-dropdown">
              <div className="notification-dropdown-header">
                <span className="notification-dropdown-title">Notifications</span>
              </div>

              <div className="notification-list">
                {notifications.map((n) => (
                  <div key={n.id} className={`notification-item ${n.unread ? 'unread' : ''}`}>
                    <div className="notification-item-icon-box icon-box-bell-green">
                      {getNotificationIcon(n.type)}
                    </div>
                    <div className="notification-item-content">
                      <span className="notification-item-text">{n.text}</span>
                      <span className="notification-item-time">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="notification-dropdown-footer">
                <button className="btn-mark-all-read" onClick={handleMarkAllRead}>
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Icon */}
        <button
          className="header-icon-btn"
          title="Toggle theme"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          onClick={toggleTheme}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="header-v-divider" />

        {/* User Info & Avatar */}
        <div className="header-user-profile">
          <div className="user-details">
            <span className="user-name">{userName}</span>
            <div className="user-status-row">
              <span className="status-dot-green" />
              <span className="status-text">Active Now</span>
            </div>
          </div>
          <img
            src={profileAvatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"}
            alt={userName}
            className="user-avatar-img"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
