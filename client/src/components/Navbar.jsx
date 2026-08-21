import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collaborationAPI } from '../services/api';
import { Sun, Moon, Bell, LogOut, ShieldAlert } from 'lucide-react';
import { Dropdown, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import logo from '../assets/logo.png';
import UserAvatar from './UserAvatar';

export default function NavigationBar() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');


  useEffect(() => {
    // Apply theme on mount
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');

      if (user && token) {
        try {
          const res = await collaborationAPI.getNotifications();
          if (res.data.success) {
            setNotifications(res.data.data);
          }
        } catch (err) {
          console.error('Failed to load notifications:', err);
        }
      } else {
        setNotifications([]);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [user]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const handleMarkRead = async (id) => {
    try {
      await collaborationAPI.markRead(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="topbar-shell navbar navbar-expand-lg px-4 py-2">
      <div className="topbar-brand d-flex align-items-center gap-3">
        <img src={logo} alt="ResearchFlow AI logo" className="topbar-logo" />
        <div className="topbar-brand-text">
          <span className="topbar-brand-title">ResearchFlow </span>
        </div>
      </div>

      <div className="topbar-actions">
        <Button variant="link" className="topbar-button theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </Button>

        {user && (
          <Dropdown align="end" className="topbar-control">
            <Dropdown.Toggle variant="link" className="topbar-button topbar-notification toggle-nocaret" aria-label="Open notifications">
              <Bell size={18} />
              {unreadCount > 0 && (
                <Badge pill bg="danger" className="topbar-badge">
                  {unreadCount}
                </Badge>
              )}
            </Dropdown.Toggle>

            <Dropdown.Menu className="topbar-dropdown-menu topbar-notification-menu shadow border-0 mt-2 py-2">
              <div className="px-3 py-2 border-bottom fw-bold d-flex justify-content-between align-items-center">
                <span>Notifications</span>
                {unreadCount > 0 && <Badge bg="primary">{unreadCount} New</Badge>}
              </div>
              {notifications.length === 0 ? (
                <div className="text-center text-muted py-4">No new notifications</div>
              ) : (
                notifications.map((n) => (
                  <div key={n._id} className="dropdown-item py-3 border-bottom d-flex gap-2 align-items-start" style={{ whiteSpace: 'normal', cursor: 'pointer' }} onClick={() => handleMarkRead(n._id)}>
                    <div className="bg-primary-subtle text-primary p-2 rounded-circle">
                      <ShieldAlert size={16} />
                    </div>
                    <div className="flex-grow-1">
                      <div className="small text-body">{n.content}</div>
                      <span className="text-muted" style={{ fontSize: '11px' }}>
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </Dropdown.Menu>
          </Dropdown>
        )}

        {user && (
          <Dropdown align="end" className="topbar-control">
            <Dropdown.Toggle variant="link" className="topbar-avatar-toggle p-0 border-0 toggle-nocaret" aria-label="Open profile menu">
              <UserAvatar user={user} size={38} className="topbar-avatar" />
            </Dropdown.Toggle>

            <Dropdown.Menu className="topbar-dropdown-menu topbar-profile-menu shadow border-0 mt-2 py-2">
              <div className="px-3 py-2 border-bottom">
                <div className="fw-bold">{user.username}</div>
                <div className="text-muted small">{user.email}</div>
                <Badge bg="secondary" className="mt-1" style={{ fontSize: '10px' }}>{user.role}</Badge>
              </div>
              <Dropdown.Item as={Link} to="/profile" className="py-2">My Profile</Dropdown.Item>
              <Dropdown.Item as={Link} to="/dashboard" className="py-2">Dashboard</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={logout} className="py-2 text-danger d-flex align-items-center gap-2">
                <LogOut size={16} />
                <span>Sign Out</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
    </nav>
  );
}
