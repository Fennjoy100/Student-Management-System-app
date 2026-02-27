import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../components/Card';
import { Search, Plus, Filter, MoreVertical, Edit, Trash2, Book, X, Save, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import './Students.css';

interface Teacher {
    id: string;
    name: string;
    subject: string;
    email: string;
    classes: string;
    status: string;
}

const Teachers = () => {
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [formData, setFormData] = useState<Partial<Teacher>>({
        id: '',
        name: '',
        subject: '',
        email: '',
        classes: '',
        status: 'Active'
    });

    // Notification and Confirmation State
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; title: string; text: string; onConfirm: () => void } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const triggerConfirm = (title: string, text: string, onConfirm: () => void) => {
        setConfirmDialog({ isOpen: true, title, text, onConfirm });
    };

    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        const query = searchParams.get('search');
        if (query) setSearchTerm(query);
        fetchTeachers();
    }, [searchParams]);

    const fetchTeachers = async () => {
        try {
            const response = await fetch('/api/teachers/');
            const data = await response.json();
            setTeachers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching teachers:', error);
            setLoading(false);
            showNotification('Failed to fetch teachers', 'error');
        }
    };

    const handleDelete = (id: string) => {
        triggerConfirm(
            'Delete Teacher?',
            'Are you sure you want to remove this teacher from the system? This action cannot be undone.',
            async () => {
                try {
                    const response = await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
                    if (response.ok) {
                        setTeachers(teachers.filter(t => t.id !== id));
                        showNotification('Teacher deleted successfully');
                    }
                } catch (error) {
                    console.error('Error deleting teacher:', error);
                    showNotification('Error deleting teacher', 'error');
                }
                setConfirmDialog(null);
            }
        );
    };

    const handleEdit = (teacher: Teacher) => {
        setEditingTeacher(teacher);
        setFormData(teacher);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingTeacher(null);
        setFormData({
            id: `TEA${Math.floor(Math.random() * 9000) + 1000}`,
            name: '',
            subject: '',
            email: '',
            classes: '',
            status: 'Active'
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingTeacher ? `/api/teachers/${editingTeacher.id}` : '/api/teachers/';
            const method = editingTeacher ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsModalOpen(false);
                fetchTeachers();
                showNotification(editingTeacher ? 'Teacher updated successfully' : 'Teacher registered successfully');
            }
        } catch (error) {
            console.error('Error saving teacher:', error);
            showNotification('Error saving teacher', 'error');
        }
    };

    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || teacher.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="students-page">
            <div className="page-header">
                <div>
                    <h1>Teachers Management</h1>
                    <p>Manage faculty members and their assignments.</p>
                </div>
                <button className="btn-primary" onClick={handleAdd}>
                    <Plus size={18} />
                    <span>Add Teacher</span>
                </button>
            </div>

            <Card className="table-card">
                <div className="table-actions">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <Filter size={18} />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="filter-select"
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="table-container">
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Subject</th>
                                    <th>Email</th>
                                    <th>Classes</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTeachers.map((teacher) => (
                                    <tr key={teacher.id}>
                                        <td className="font-mono">{teacher.id}</td>
                                        <td>
                                            <div className="student-name-cell">
                                                <div className="avatar-small" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                                                    {teacher.name.charAt(0)}
                                                </div>
                                                <span>{teacher.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="subject-tag">
                                                <Book size={14} /> {teacher.subject}
                                            </span>
                                        </td>
                                        <td>{teacher.email}</td>
                                        <td>{teacher.classes}</td>
                                        <td>
                                            <span className={`status-badge ${teacher.status.toLowerCase().replace(' ', '-')}`}>
                                                {teacher.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                <button title="Edit" className="action-btn edit" onClick={() => handleEdit(teacher)}><Edit size={16} /></button>
                                                <button title="Delete" className="action-btn delete" onClick={() => handleDelete(teacher.id)}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredTeachers.length === 0 && (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                            No teachers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>

            {/* Modal for Add/Edit */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <Card className="modal-card" title={editingTeacher ? "Edit Teacher" : "Add New Teacher"}>
                        <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                            <X size={20} />
                        </button>
                        <form onSubmit={handleSubmit} className="student-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Dr. Sarah Smith"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="Mathematics"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="sarah.s@example.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Classes</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.classes}
                                        onChange={e => setFormData({ ...formData, classes: e.target.value })}
                                        placeholder="10A, 11B"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="On Leave">On Leave</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">
                                    <Save size={18} />
                                    <span>{editingTeacher ? "Update Teacher" : "Register Teacher"}</span>
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
                                Confirm Delete
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

export default Teachers;
