import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Attendance from './pages/Attendance';
import Grades from './pages/Grades';
import Courses from './pages/Courses';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isLoggedIn') !== 'false';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Initial theme setup
    const savedTheme = localStorage.getItem('theme') || 'normal';
    document.body.classList.remove('light-mode', 'dark-mode');
    if (savedTheme === 'light') document.body.classList.add('light-mode');
    if (savedTheme === 'dark') document.body.classList.add('dark-mode');
  }, []);

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    setIsAuthenticated(false);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => {
      localStorage.setItem('isLoggedIn', 'true');
      setIsAuthenticated(true);
    }} />;
  }

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} onLogout={handleLogout} />

      {/* Mobile Backdrop */}
      {sidebarOpen && <div className="sidebar-backdrop" onClick={closeSidebar}></div>}

      <main className="main-content">
        <Navbar onToggleSidebar={toggleSidebar} onLogout={handleLogout} />
        <div className="content-inner">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/grades" element={<Grades />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
