import { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Calendar, CheckCircle2, XCircle, AlertCircle, Save, Plus, X, UserPlus, Edit2, Trash2, CheckCircle, HelpCircle } from 'lucide-react';
import './Attendance.css';

interface AttendanceRecord {
    id: string;
    name: string;
    grade: string;
    status: 'present' | 'absent' | 'late';
    remark: string;
}

const Attendance = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedClass, setSelectedClass] = useState('10A');
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<AttendanceRecord | null>(null);
    const [formData, setFormData] = useState({ id: '', name: '' });

    // Glowing Notification State
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; title: string; text: string; onConfirm: () => void } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const triggerConfirm = (title: string, text: string, onConfirm: () => void) => {
        setConfirmDialog({ isOpen: true, title, text, onConfirm });
    };

    // Initial mock data
    const initialStudents: AttendanceRecord[] = [
        { id: 'STU001', name: 'James Wilson', grade: '10A', status: 'present', remark: '' },
        { id: 'STU002', name: 'Emma Thompson', grade: '10A', status: 'present', remark: '' },
        { id: 'STU003', name: 'Robert Davis', grade: '10A', status: 'absent', remark: '' },
        { id: 'STU004', name: 'Olivia Martinez', grade: '10A', status: 'late', remark: '' },
        { id: 'STU005', name: 'William Taylor', grade: '10A', status: 'present', remark: '' },
        { id: 'STU006', name: 'Sophia Chen', grade: '10B', status: 'present', remark: '' },
        { id: 'STU007', name: 'Lucas Hedges', grade: '10B', status: 'absent', remark: '' },
    ];

    const fetchAttendance = async () => {
        try {
            const response = await fetch(`/api/attendance/?date=${selectedDate}&class=${selectedClass}`);
            const result = await response.json();

            if (result.data && result.data.length > 0) {
                setAttendanceData(result.data[0].records);
            } else {
                const filtered = initialStudents.filter(s => s.grade === selectedClass);
                setAttendanceData(filtered.map(s => ({ ...s, status: 'present', remark: '' })));
            }
        } catch (error) {
            console.error('Error fetching attendance:', error);
            const filtered = initialStudents.filter(s => s.grade === selectedClass);
            setAttendanceData(filtered);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [selectedDate, selectedClass]);

    const handleStatusChange = (id: string, status: 'present' | 'absent' | 'late') => {
        setAttendanceData(prev => prev.map(record =>
            record.id === id ? { ...record, status } : record
        ));
    };

    const handleRemarkChange = (id: string, remark: string) => {
        setAttendanceData(prev => prev.map(record =>
            record.id === id ? { ...record, remark } : record
        ));
    };

    const calculateStats = () => {
        const stats = {
            present: attendanceData.filter(r => r.status === 'present').length,
            absent: attendanceData.filter(r => r.status === 'absent').length,
            late: attendanceData.filter(r => r.status === 'late').length,
        };
        return stats;
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/attendance/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: selectedDate,
                    class: selectedClass,
                    records: attendanceData
                })
            });
            if (response.ok) {
                showNotification('Attendance records saved successfully!');
            }
        } catch (error) {
            console.error('Error saving attendance:', error);
            showNotification('Failed to save attendance', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.id || !formData.name) return;

        if (editingStudent) {
            setAttendanceData(prev => prev.map(record =>
                record.id === editingStudent.id ? { ...record, id: formData.id, name: formData.name } : record
            ));
            showNotification('Student details updated');
        } else {
            const record: AttendanceRecord = {
                id: formData.id,
                name: formData.name,
                grade: selectedClass,
                status: 'present',
                remark: ''
            };
            setAttendanceData(prev => [...prev, record]);
            showNotification('Student added to today\'s sheet');
        }

        setFormData({ id: '', name: '' });
        setEditingStudent(null);
        setIsModalOpen(false);
    };

    const handleDeleteStudent = (id: string) => {
        triggerConfirm(
            'Remove Student?',
            'Are you sure you want to remove this student from today\'s attendance sheet?',
            () => {
                setAttendanceData(prev => prev.filter(student => student.id !== id));
                showNotification('Student removed from sheet');
                setConfirmDialog(null);
            }
        );
    };

    const openAddModal = () => {
        setEditingStudent(null);
        setFormData({ id: '', name: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (student: AttendanceRecord) => {
        setEditingStudent(student);
        setFormData({ id: student.id, name: student.name });
        setIsModalOpen(true);
    };

    const stats = calculateStats();

    return (
        <div className="attendance-page">
            <div className="page-header">
                <div>
                    <h1>Attendance Tracking</h1>
                    <p>Mark and review daily attendance records.</p>
                </div>
                <div className="header-actions" style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-success" onClick={openAddModal}>
                        <Plus size={18} />
                        <span>Add Student</span>
                    </button>
                    <button className="btn-primary" onClick={handleSave} disabled={saving}>
                        <Save size={18} />
                        <span>{saving ? 'Saving...' : 'Save Attendance'}</span>
                    </button>
                </div>
            </div>

            <div className="attendance-controls">
                <Card className="control-card">
                    <div className="controls-inner">
                        <div className="control-group">
                            <label><Calendar size={14} /> Select Date</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                        <div className="control-group">
                            <label>Select Class</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="10A">Grade 10A</option>
                                <option value="10B">Grade 10B</option>
                            </select>
                        </div>
                        <div className="attendance-stats-brief">
                            <div className="stat-brief">
                                <span className="dot present"></span>
                                <span>Present: {stats.present}</span>
                            </div>
                            <div className="stat-brief">
                                <span className="dot absent"></span>
                                <span>Absent: {stats.absent}</span>
                            </div>
                            <div className="stat-brief">
                                <span className="dot late"></span>
                                <span>Late: {stats.late}</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="attendance-table-card">
                <div className="attendance-table-container">
                    <table className="attendance-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Status</th>
                                <th>Remarks</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.map(record => (
                                <tr key={record.id}>
                                    <td className="student-info-cell">
                                        <span className="stu-id">{record.id}</span>
                                        <span className="stu-name">{record.name}</span>
                                    </td>
                                    <td>
                                        <div className="status-options">
                                            <button
                                                className={`status-opt present ${record.status === 'present' ? 'active' : ''}`}
                                                onClick={() => handleStatusChange(record.id, 'present')}
                                            >
                                                <CheckCircle2 size={16} /> Present
                                            </button>
                                            <button
                                                className={`status-opt absent ${record.status === 'absent' ? 'active' : ''}`}
                                                onClick={() => handleStatusChange(record.id, 'absent')}
                                            >
                                                <XCircle size={16} /> Absent
                                            </button>
                                            <button
                                                className={`status-opt late ${record.status === 'late' ? 'active' : ''}`}
                                                onClick={() => handleStatusChange(record.id, 'late')}
                                            >
                                                <AlertCircle size={16} /> Late
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="Add a note..."
                                            className="remark-input"
                                            value={record.remark}
                                            onChange={(e) => handleRemarkChange(record.id, e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <div className="table-actions-cell" style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="action-btn edit" onClick={() => openEditModal(record)} title="Edit Student">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="action-btn delete" onClick={() => handleDeleteStudent(record.id)} title="Remove Student">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Modal for Add/Edit */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <Card className="modal-card" title={editingStudent ? "Edit Student Details" : "Add Student to Sheet"}>
                        <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                            <X size={20} />
                        </button>
                        <form onSubmit={handleFormSubmit} className="student-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Student ID</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.id}
                                        onChange={e => setFormData({ ...formData, id: e.target.value })}
                                        placeholder="e.g. STU999"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Student Name"
                                    />
                                </div>
                            </div>
                            <div className="form-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">
                                    {editingStudent ? <Save size={18} /> : <UserPlus size={18} />}
                                    <span>{editingStudent ? 'Update Details' : 'Add to Sheet'}</span>
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {/* Glowing Confirmation Dialog */}
            {confirmDialog && confirmDialog.isOpen && (
                <div className="confirm-modal-overlay">
                    <Card className="modal-card confirm-modal">
                        <div className="confirm-icon">
                            <HelpCircle size={32} />
                        </div>
                        <h2 className="confirm-title">{confirmDialog.title}</h2>
                        <p className="confirm-text">{confirmDialog.text}</p>
                        <div className="confirm-footer">
                            <button className="btn-secondary" onClick={() => setConfirmDialog(null)}>Cancel</button>
                            <button className="btn-primary" style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--danger)', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)' }} onClick={confirmDialog.onConfirm}>
                                Confirm Remove
                            </button>
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

export default Attendance;
