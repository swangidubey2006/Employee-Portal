import React from 'react';
import { Search, Bell, Moon } from 'lucide-react';

const Header = () => {
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = savedUser.fullName || 'Shristi Kumari';

  return (
    <header className="dashboard-header">
      {/* Search Input */}
      <div className="header-search-wrapper">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="header-search-input"
          placeholder="Search tasks, documents, or employees..."
        />
      </div>

      {/* Right User & Utility Group */}
      <div className="header-right-group">
        {/* Notification Icon */}
        <button className="header-icon-btn" title="Notifications" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-badge-dot" />
        </button>

        {/* Theme Toggle Icon */}
        <button className="header-icon-btn" title="Toggle theme" aria-label="Toggle theme">
          <Moon size={18} />
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
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
            alt="Shristi Kumari"
            className="user-avatar-img"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
