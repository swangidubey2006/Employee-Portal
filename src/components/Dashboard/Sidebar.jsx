import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  CheckSquare,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Attendance', path: '/attendance', icon: Calendar },
    { name: 'Leave Management', path: '/leave-management', icon: CalendarCheck },
    { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Employee Directory', path: '/directory', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Menu Hamburger */}
      <button 
        className="mobile-sidebar-toggle" 
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile drawer */}
      {mobileOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      <aside className={`sidebar-container ${mobileOpen ? 'open' : ''}`}>
        {/* Top Logo */}
        <div className="sidebar-logo-header">
          <h1 className="sidebar-brand-title">GYANYUG</h1>
          <p className="sidebar-brand-sub">POWERED BY RIG INNOVATIONS</p>
        </div>

        {/* Nav Items */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
            
            return (
              <button
                key={item.name}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
              >
                <Icon size={18} className="nav-icon" />
                <span className="nav-text">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Logout */}
        <div className="sidebar-footer">
          <div className="sidebar-divider" />
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <LogOut size={18} className="nav-icon" />
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
