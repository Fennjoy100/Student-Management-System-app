import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  BookOpen,
  CalendarCheck,
  GraduationCap,
  Settings,
  LogOut
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, isOpen, onClose }) => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Users size={20} />, label: 'Students', path: '/students' },
    { icon: <UserSquare2 size={20} />, label: 'Teachers', path: '/teachers' },
    { icon: <BookOpen size={20} />, label: 'Courses', path: '/courses' },
    { icon: <CalendarCheck size={20} />, label: 'Attendance', path: '/attendance' },
    { icon: <GraduationCap size={20} />, label: 'Results', path: '/grades' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-icon">C</div>
        <h2>Chart</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} onClick={onClose}>
              <NavLink
                to={item.path}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={() => { onLogout(); onClose(); }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
