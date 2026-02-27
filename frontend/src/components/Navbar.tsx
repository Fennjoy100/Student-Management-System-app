import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    return (
        <header className="navbar">
            <div className="search-bar">
                <Search size={18} />
                <input type="text" placeholder="Search students, classes, results..." />
            </div>

            <div className="navbar-actions">
                <button className="icon-btn" title="Notifications">
                    <Bell size={20} />
                    <span className="badge"></span>
                </button>

                <div className="v-divider"></div>

                <div className="user-profile">
                    <div className="user-info">
                        <span className="user-name">Admin User</span>
                        <span className="user-role">Super Admin</span>
                    </div>
                    <div className="user-avatar">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
