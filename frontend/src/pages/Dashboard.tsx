import React from 'react';
import Card from '../components/Card';
import { Users, GraduationCap, Briefcase, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const stats = [
        { label: 'Total Students', value: '1,284', icon: <Users size={24} />, trend: '+12%', color: 'blue' },
        { label: 'Active Courses', value: '42', icon: <GraduationCap size={24} />, trend: '+3%', color: 'green' },
        { label: 'Staff Members', value: '86', icon: <Briefcase size={24} />, trend: '0%', color: 'purple' },
        { label: 'Avg. Attendance', value: '92%', icon: <TrendingUp size={24} />, trend: '+5%', color: 'amber' },
    ];

    const recentActivity = [
        { id: 1, action: 'Grade updated for Sarah Connor', time: '10 mins ago', type: 'grade' },
        { id: 2, action: 'New student enrolled: John Wick', time: '45 mins ago', type: 'enroll' },
        { id: 3, action: 'Attendance marked for Class 10A', time: '2 hours ago', type: 'attendance' },
        { id: 4, action: 'Teacher meeting scheduled', time: '5 hours ago', type: 'meeting' },
    ];

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Dashboard Overview</h1>
                <p>Welcome back, Admin. Here's what's happening today.</p>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <Card key={index} className={`stat-card ${stat.color}`}>
                        <div className="stat-content">
                            <span className="stat-label">{stat.label}</span>
                            <h2 className="stat-value">{stat.value}</h2>
                            <span className="stat-trend">{stat.trend} from last month</span>
                        </div>
                        <div className={`stat-icon-wrapper ${stat.color}`}>
                            {stat.icon}
                        </div>
                    </Card>
                ))}
            </div>

            <div className="dashboard-main">
                <Card title="Recent Activity" className="activity-card">
                    <ul className="activity-list">
                        {recentActivity.map((activity) => (
                            <li key={activity.id} className="activity-item">
                                <div className="activity-icon">
                                    <Clock size={16} />
                                </div>
                                <div className="activity-details">
                                    <p>{activity.action}</p>
                                    <span>{activity.time}</span>
                                </div>
                                <div className="activity-status">
                                    <CheckCircle size={16} className="text-success" />
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card title="Upcoming Exams" className="exams-card">
                    <div className="empty-state">
                        <GraduationCap size={48} />
                        <p>No exams scheduled for this week.</p>
                        <button className="btn-primary">Schedule New</button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
