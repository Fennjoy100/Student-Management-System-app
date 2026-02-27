import { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Users, GraduationCap, Briefcase, TrendingUp, Clock, CheckCircle, Plus, Edit2, Trash2, X, Save, Calendar, AlertCircle, HelpCircle } from 'lucide-react';
import './Dashboard.css';

interface Exam {
    id: string;
    subject: string;
    date: string;
    class: string;
}

interface Activity {
    id: number;
    action: string;
    time: string;
    type: string;
}

const Dashboard = () => {
    // Stat States
    const [totalStudents, setTotalStudents] = useState(1284);
    const [activeCourses, setActiveCourses] = useState(42);
    const [staffMembers, setStaffMembers] = useState(86);
    const [avgAttendance, setAvgAttendance] = useState(92);

    const [activities, setActivities] = useState<Activity[]>([
        { id: 1, action: 'Grade updated for Sarah Connor', time: '10 mins ago', type: 'grade' },
        { id: 2, action: 'New student enrolled: John Wick', time: '45 mins ago', type: 'enroll' },
        { id: 3, action: 'Attendance marked for Class 10A', time: '2 hours ago', type: 'attendance' },
        { id: 4, action: 'Teacher meeting scheduled', time: '5 hours ago', type: 'meeting' },
    ]);

    const [exams, setExams] = useState<Exam[]>([
        { id: '1', subject: 'Mathematics Mid-Term', date: '2026-03-15', class: 'Grade 10A' },
        { id: '2', subject: 'Physics Practical', date: '2026-03-18', class: 'Grade 11B' }
    ]);

    // Notification State
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; title: string; text: string; onConfirm: () => void } | null>(null);

    // Modal States
    const [isExamModalOpen, setIsExamModalOpen] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

    const [editingExam, setEditingExam] = useState<Exam | null>(null);
    const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

    const [examFormData, setExamFormData] = useState({ subject: '', date: '', class: 'Grade 10A' });
    const [activityFormData, setActivityFormData] = useState({ action: '', time: 'Just now' });
    const [statsFormData, setStatsFormData] = useState({ students: totalStudents, courses: activeCourses, staff: staffMembers });

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const triggerConfirm = (title: string, text: string, onConfirm: () => void) => {
        setConfirmDialog({ isOpen: true, title, text, onConfirm });
    };

    // Auto-calculate Attendance logic
    useEffect(() => {
        // Base attendance is 92%. We vary it based on the relation of students to staff/courses
        // Higher student count relative to staff slightly lowers attendance (stress on system)
        // Higher courses count slightly increases engagement
        const base = 92;
        const studentFactor = (totalStudents - 1284) / 100;
        const courseFactor = (activeCourses - 42) / 10;
        const staffFactor = (staffMembers - 86) / 5;

        let newAvg = Math.round(base + courseFactor + staffFactor - studentFactor);
        newAvg = Math.min(100, Math.max(0, newAvg));

        setAvgAttendance(newAvg);
    }, [totalStudents, activeCourses, staffMembers]);

    const handleStatsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTotalStudents(statsFormData.students);
        setActiveCourses(statsFormData.courses);
        setStaffMembers(statsFormData.staff);
        setIsStatsModalOpen(false);
        showNotification('Global metrics updated and attendance recalculated');
    };

    const handleDeleteActivity = (id: number) => {
        triggerConfirm(
            'Clear Activity?',
            'Are you sure you want to remove this activity log?',
            () => {
                setActivities(prev => prev.filter(a => a.id !== id));
                showNotification('Activity log removed');
                setConfirmDialog(null);
            }
        );
    };

    const handleActivitySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activityFormData.action) return;

        if (editingActivity) {
            setActivities(prev => prev.map(a =>
                a.id === editingActivity.id ? { ...a, action: activityFormData.action, time: activityFormData.time } : a
            ));
            showNotification('Activity updated');
        } else {
            const newActivity = {
                id: Date.now(),
                action: activityFormData.action,
                time: activityFormData.time,
                type: 'manual'
            };
            setActivities(prev => [newActivity, ...prev]);
            showNotification('Activity added to dashboard');
        }
        setIsActivityModalOpen(false);
        setEditingActivity(null);
        setActivityFormData({ action: '', time: 'Just now' });
    };

    const handleDeleteExam = (id: string) => {
        triggerConfirm(
            'Cancel Exam?',
            'Are you sure you want to remove this scheduled exam?',
            () => {
                setExams(prev => prev.filter(e => e.id !== id));
                showNotification('Exam removed from schedule');
                setConfirmDialog(null);
            }
        );
    };

    const handleExamSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!examFormData.subject || !examFormData.date) return;

        if (editingExam) {
            setExams(prev => prev.map(ex =>
                ex.id === editingExam.id ? { ...ex, ...examFormData } : ex
            ));
            showNotification('Exam schedule updated');
        } else {
            const newExam = {
                id: Math.random().toString(36).substr(2, 9),
                ...examFormData
            };
            setExams(prev => [...prev, newExam]);
            showNotification('New exam scheduled');
        }
        setIsExamModalOpen(false);
        setEditingExam(null);
        setExamFormData({ subject: '', date: '', class: 'Grade 10A' });
    };

    const stats = [
        { label: 'Total Students', value: totalStudents.toLocaleString(), icon: <Users size={24} />, trend: '+12%', color: 'blue' },
        { label: 'Active Courses', value: activeCourses.toString(), icon: <GraduationCap size={24} />, trend: '+3%', color: 'green' },
        { label: 'Staff Members', value: staffMembers.toString(), icon: <Briefcase size={24} />, trend: '0%', color: 'purple' },
        { label: 'Avg. Attendance', value: `${avgAttendance}%`, icon: <TrendingUp size={24} />, trend: '+5%', color: 'amber' },
    ];

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1>Dashboard Overview</h1>
                    <p>Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-secondary" onClick={() => { setStatsFormData({ students: totalStudents, courses: activeCourses, staff: staffMembers }); setIsStatsModalOpen(true); }}>
                        <Edit2 size={18} />
                        Edit Stats
                    </button>
                    <button className="btn-success" onClick={() => { setEditingActivity(null); setActivityFormData({ action: '', time: 'Just now' }); setIsActivityModalOpen(true); }}>
                        <Plus size={18} />
                        Add Activity
                    </button>
                    <button className="btn-primary" onClick={() => { setEditingExam(null); setExamFormData({ subject: '', date: '', class: 'Grade 10A' }); setIsExamModalOpen(true); }}>
                        <Calendar size={18} />
                        Schedule Exam
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <Card key={index} className={`stat-card ${stat.color}`}>
                        <div className="stat-content">
                            <span className="stat-label">{stat.label}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h2 className="stat-value">{stat.value}</h2>
                                {stat.label !== 'Avg. Attendance' && (
                                    <button
                                        className="edit-stat-btn"
                                        onClick={() => {
                                            setStatsFormData({ students: totalStudents, courses: activeCourses, staff: staffMembers });
                                            setIsStatsModalOpen(true);
                                        }}
                                        title={`Edit ${stat.label}`}
                                        style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                )}
                            </div>
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
                        {activities.map((activity) => (
                            <li key={activity.id} className="activity-item">
                                <div className="activity-icon">
                                    <Clock size={16} />
                                </div>
                                <div className="activity-details">
                                    <p>{activity.action}</p>
                                    <span>{activity.time}</span>
                                </div>
                                <div className="dashboard-action-btns">
                                    <button className="dash-action-btn edit" onClick={() => { setEditingActivity(activity); setActivityFormData({ action: activity.action, time: activity.time }); setIsActivityModalOpen(true); }} title="Edit log">
                                        <Edit2 size={12} />
                                    </button>
                                    <button className="dash-action-btn delete" onClick={() => handleDeleteActivity(activity.id)} title="Clear log">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                                <div className="activity-status">
                                    <CheckCircle size={16} className="text-success" />
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card title="Upcoming Exams" className="exams-card">
                    {exams.length > 0 ? (
                        <div className="exam-list">
                            {exams.map(exam => (
                                <div key={exam.id} className="exam-item">
                                    <div className="exam-icon">
                                        <GraduationCap size={20} />
                                    </div>
                                    <div className="exam-info">
                                        <h4>{exam.subject}</h4>
                                        <p>{exam.class} • {new Date(exam.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="dashboard-action-btns">
                                        <button className="dash-action-btn edit" onClick={() => { setEditingExam(exam); setExamFormData({ subject: exam.subject, date: exam.date, class: exam.class }); setIsExamModalOpen(true); }}>
                                            <Edit2 size={14} />
                                        </button>
                                        <button className="dash-action-btn delete" onClick={() => handleDeleteExam(exam.id)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Calendar size={48} />
                            <p>No exams scheduled for this week.</p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Stats Edit Modal */}
            {isStatsModalOpen && (
                <div className="modal-overlay">
                    <Card className="modal-card" title="Edit Dashboard Metrics">
                        <button className="modal-close" onClick={() => setIsStatsModalOpen(false)}><X size={20} /></button>
                        <form onSubmit={handleStatsSubmit} className="exam-form">
                            <div className="form-group">
                                <label>Total Students</label>
                                <input type="number" required value={statsFormData.students} onChange={e => setStatsFormData({ ...statsFormData, students: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Active Courses</label>
                                    <input type="number" required value={statsFormData.courses} onChange={e => setStatsFormData({ ...statsFormData, courses: parseInt(e.target.value) || 0 })} />
                                </div>
                                <div className="form-group">
                                    <label>Staff Members</label>
                                    <input type="number" required value={statsFormData.staff} onChange={e => setStatsFormData({ ...statsFormData, staff: parseInt(e.target.value) || 0 })} />
                                </div>
                            </div>
                            <div className="info-box" style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '10px', borderRadius: '8px', fontSize: '13px', color: 'var(--primary)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <AlertCircle size={16} />
                                <span>Attendance will be automatically recalculated based on these values.</span>
                            </div>
                            <div className="form-footer" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button type="button" className="btn-secondary" onClick={() => setIsStatsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ margin: 0 }}><Save size={18} /> Update Stat</button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {/* Exam Modal */}
            {isExamModalOpen && (
                <div className="modal-overlay">
                    <Card className="modal-card" title={editingExam ? "Edit Exam" : "Schedule New Exam"}>
                        <button className="modal-close" onClick={() => setIsExamModalOpen(false)}><X size={20} /></button>
                        <form onSubmit={handleExamSubmit} className="exam-form">
                            <div className="form-group">
                                <label>Subject Title</label>
                                <input type="text" required value={examFormData.subject} onChange={e => setExamFormData({ ...examFormData, subject: e.target.value })} />
                            </div>
                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input type="date" required value={examFormData.date} onChange={e => setExamFormData({ ...examFormData, date: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Class</label>
                                    <select value={examFormData.class} onChange={e => setExamFormData({ ...examFormData, class: e.target.value })}>
                                        <option>Grade 10A</option>
                                        <option>Grade 10B</option>
                                        <option>Grade 11A</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-footer" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button type="button" className="btn-secondary" onClick={() => setIsExamModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ margin: 0 }}><Save size={18} /> {editingExam ? 'Update' : 'Schedule'}</button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {/* Activity Modal */}
            {isActivityModalOpen && (
                <div className="modal-overlay">
                    <Card className="modal-card" title={editingActivity ? "Edit Activity Log" : "Add Activity Log"}>
                        <button className="modal-close" onClick={() => setIsActivityModalOpen(false)}><X size={20} /></button>
                        <form onSubmit={handleActivitySubmit} className="exam-form">
                            <div className="form-group">
                                <label>Activity Description</label>
                                <input type="text" required value={activityFormData.action} onChange={e => setActivityFormData({ ...activityFormData, action: e.target.value })} placeholder="e.g. System maintenance performed" />
                            </div>
                            <div className="form-group">
                                <label>Time / Relative Time</label>
                                <input type="text" required value={activityFormData.time} onChange={e => setActivityFormData({ ...activityFormData, time: e.target.value })} placeholder="e.g. 2 hours ago" />
                            </div>
                            <div className="form-footer" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button type="button" className="btn-secondary" onClick={() => setIsActivityModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ margin: 0 }}><Save size={18} /> {editingActivity ? 'Update log' : 'Add Activity'}</button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {/* Glowing Confirmation Dialog */}
            {confirmDialog && confirmDialog.isOpen && (
                <div className="confirm-modal-overlay">
                    <Card className="modal-card confirm-modal">
                        <div className="confirm-icon"><HelpCircle size={32} /></div>
                        <h2 className="confirm-title">{confirmDialog.title}</h2>
                        <p className="confirm-text">{confirmDialog.text}</p>
                        <div className="confirm-footer">
                            <button className="btn-secondary" onClick={() => setConfirmDialog(null)}>Cancel</button>
                            <button className="btn-primary" style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={confirmDialog.onConfirm}>Confirm Action</button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Glowing Toast Notification */}
            {toast && (
                <div className={`glowing-toast ${toast.type}`}>
                    <div className="toast-icon">
                        {toast.type === 'success' ? <CheckCircle size={14} color="white" /> : <AlertCircle size={14} color="white" />}
                    </div>
                    <span>{toast.message}</span>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
