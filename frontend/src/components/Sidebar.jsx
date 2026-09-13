import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  AlertTriangle,
  CheckSquare,
  Package,
  Home,
  MapPin,
  BarChart3,
  Bell,
  User,
  LogOut,
  Radio,
  Map,
  AlertOctagon
} from 'lucide-react';
import { authService } from '../services/storageService';

export const Sidebar = ({ currentUser, onLogout }) => {
  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-badge">
          <ShieldAlert size={22} />
        </div>
        <div>
          <h2 className="brand-title">ReliefCoord</h2>
          <span className="brand-sub">Disaster Response System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          <span className="nav-section-title">Main Menu</span>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Bell size={18} />
            <span>Notifications</span>
          </NavLink>

          <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BarChart3 size={18} />
            <span>Reports & Analytics</span>
          </NavLink>
        </div>

        <div className="nav-group">
          <span className="nav-section-title">Emergency Response</span>
          <NavLink to="/emergency-radio" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Radio size={18} color="var(--accent-rose)" />
            <span>Emergency Radio (PTT)</span>
          </NavLink>

          <NavLink to="/emergency-map" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Map size={18} color="var(--accent-sky)" />
            <span>Emergency Map</span>
          </NavLink>

          {isAdmin && (
            <NavLink to="/sos-alerts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <AlertOctagon size={18} color="#ef4444" />
              <span>SOS Emergency Center</span>
            </NavLink>
          )}
        </div>

        <div className="nav-group">
          <span className="nav-section-title">Crisis Operations</span>
          <NavLink to="/disasters" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <AlertTriangle size={18} />
            <span>Disaster Events</span>
          </NavLink>

          <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <CheckSquare size={18} />
            <span>Tasks & Duties</span>
          </NavLink>

          <NavLink to="/relief-centers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Home size={18} />
            <span>Relief Shelters</span>
          </NavLink>
        </div>

        <div className="nav-group">
          <span className="nav-section-title">Resources & Workforce</span>
          <NavLink to="/volunteers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={18} />
            <span>Volunteers</span>
          </NavLink>

          <NavLink to="/resources" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Package size={18} />
            <span>Emergency Supplies</span>
          </NavLink>

          <NavLink to="/locations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <MapPin size={18} />
            <span>Locations</span>
          </NavLink>
        </div>

        <div className="nav-group" style={{ marginTop: 'auto' }}>
          <span className="nav-section-title">Account</span>
          <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <User size={18} />
            <span>My Profile</span>
          </NavLink>

          <button onClick={onLogout} className="nav-item" style={{ background: 'transparent', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
            <LogOut size={18} />
            <span style={{ color: '#f43f5e' }}>Sign Out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

