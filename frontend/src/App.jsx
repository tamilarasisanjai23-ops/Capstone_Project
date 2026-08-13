import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authService, initializeStorage } from './services/storageService';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Volunteers from './pages/Volunteers';
import Disasters from './pages/Disasters';
import Tasks from './pages/Tasks';
import Resources from './pages/Resources';
import ReliefCenters from './pages/ReliefCenters';
import Locations from './pages/Locations';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

export function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeStorage();
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);

    const handleAuthChange = () => {
      const u = authService.getCurrentUser();
      setCurrentUser(u);
    };

    window.addEventListener('vdr-auth-change', handleAuthChange);
    return () => window.removeEventListener('vdr-auth-change', handleAuthChange);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
        Loading Disaster Relief System...
      </div>
    );
  }

  return (
    <BrowserRouter>
      {currentUser ? (
        <div className="app-container">
          <Sidebar currentUser={currentUser} onLogout={handleLogout} />
          <div className="main-wrapper">
            <Navbar currentUser={currentUser} onLogout={handleLogout} />
            <main className="page-content">
              <Routes>
                <Route path="/dashboard" element={<Dashboard currentUser={currentUser} />} />
                <Route path="/volunteers" element={<Volunteers currentUser={currentUser} />} />
                <Route path="/disasters" element={<Disasters currentUser={currentUser} />} />
                <Route path="/tasks" element={<Tasks currentUser={currentUser} />} />
                <Route path="/resources" element={<Resources currentUser={currentUser} />} />
                <Route path="/relief-centers" element={<ReliefCenters currentUser={currentUser} />} />
                <Route path="/locations" element={<Locations currentUser={currentUser} />} />
                <Route path="/reports" element={<Reports currentUser={currentUser} />} />
                <Route path="/notifications" element={<Notifications currentUser={currentUser} />} />
                <Route path="/profile" element={<Profile currentUser={currentUser} onUserUpdate={setCurrentUser} />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={setCurrentUser} />} />
          <Route path="/register" element={<Register onLoginSuccess={setCurrentUser} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
