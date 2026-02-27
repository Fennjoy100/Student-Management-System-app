import { useState } from 'react';
import { Search, Bell, User, Settings, LogOut, ShieldCheck, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
    onLogout: () => void;
    onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout, onToggleSidebar }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            if (term.includes('teacher')) {
                navigate(`/teachers?search=${encodeURIComponent(searchTerm)}`);
            } else if (term.includes('class') || term.includes('course')) {
                navigate(`/courses?search=${encodeURIComponent(searchTerm)}`);
            } else if (term.includes('result') || term.includes('grade')) {
                navigate(`/grades?search=${encodeURIComponent(searchTerm)}`);
            } else {
                navigate(`/students?search=${encodeURIComponent(searchTerm)}`);
            }
        }
    };

    const handleLogoutClick = () => {
        setIsProfileOpen(false);
        onLogout();
    };

    const handleProfileClick = () => {
        setIsProfileOpen(false);
        navigate('/profile');
    };

    return (
        <header className="navbar">
            <button className="menu-toggle" onClick={onToggleSidebar}>
                <Menu size={24} />
            </button>
            <div className="search-bar">
                <Search size={18} />
                <input
                    type="text"
                    placeholder="Search students, classes, results..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                />
            </div>

            <div className="navbar-actions">
                <button className="icon-btn" title="Notifications">
                    <Bell size={20} />
                    <span className="badge"></span>
                </button>

                <div className="v-divider"></div>

                <div className="user-profile-container">
                    <div className="user-profile" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                        <div className="user-info">
                            <span className="user-name">Admin User</span>
                            <span className="user-role">Super Admin</span>
                        </div>
                        <div className="user-avatar">
                            <User size={20} />
                        </div>
                    </div>

                    {isProfileOpen && (
                        <div className="profile-dropdown">
                            <button className="dropdown-item" onClick={handleProfileClick}>
                                <User size={16} />
                                <span>My Profile</span>
                            </button>
                            <button className="dropdown-item">
                                <ShieldCheck size={16} />
                                <span>Security Settings</span>
                            </button>
                            <button className="dropdown-item">
                                <Settings size={16} />
                                <span>Admin Panel</span>
                            </button>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item text-danger" onClick={handleLogoutClick}>
                                <LogOut size={16} />
                                <span>Log Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
