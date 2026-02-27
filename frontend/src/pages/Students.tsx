import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../components/Card';
import { Search, Plus, Filter, Edit, Trash2, Mail, Phone, X, Save, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import './Students.css';

interface Student {
    id: string;
    name: string;
    grade: string;
    email: string;
    phone: string;
    status: string;
}

const Students = () => {
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [formData, setFormData] = useState<Partial<Student>>({
        id: '',
        name: '',
        grade: '',
        email: '',
        phone: '',
        status: 'Active'
    });

    const [filterStatus, setFilterStatus] = useState('All');

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

    useEffect(() => {
        const query = searchParams.get('search');
        if (query) setSearchTerm(query);
        fetchStudents();
    }, [searchParams]);

    const fetchStudents = async () => {
        try {
            const response = await fetch('/api/students');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setStudents(data);
            setLoading(false);
        } catch (error: any) {
            console.error('Error fetching students:', error);
            setLoading(false);
            showNotification(`Failed to load students: ${error.message || 'Unknown error'}`, 'error');
        }
    };

    const handleDelete = (id: string) => {
        triggerConfirm(
            'Delete Student Record?',
            'Are you sure you want to remove this student? This will delete all their academic history.',
            async () => {
                try {
                    const response = await fetch(`/api/students/${id}`, { method: 'DELETE' });
                    if (response.ok) {
                        setStudents(students.filter(s => s.id !== id));
                        showNotification('Student record deleted successfully');
                    }
                } catch (error) {
                    console.error('Error deleting student:', error);
                    showNotification('Error deleting record', 'error');
                }
                setConfirmDialog(null);
            }
        );
    };

    const handleEdit = (student: Student) => {
        setEditingStudent(student);
        setFormData(student);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingStudent(null);
        setFormData({
            id: `STU${Math.floor(Math.random() * 9000) + 1000}`,
            name: '',
            grade: '',
            email: '',
            phone: '',
            status: 'Active'
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingStudent ? `/api/students/${editingStudent.id}` : '/api/students';
            const method = editingStudent ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsModalOpen(false);
                fetchStudents();
                showNotification(editingStudent ? 'Student details updated' : 'Student registered successfully');
            }
        } catch (error) {
            console.error('Error saving student:', error);
            showNotification('Error saving student details', 'error');
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || student.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="students-page">
            <div className="page-header">
                <div>
                    <h1>Students Management</h1>
                    <p>Manage, add, and update student records.</p>
                </div>
                <button className="btn-primary" onClick={handleAdd}>
                    <Plus size={18} />
                    <span>Add Student</span>
                </button>
            </div>

            <Card className="table-card">
                <div className="table-actions">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
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
                                    <th>Grade</th>
                                    <th>Contact info</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => (
                                    <tr key={student.id}>
                                        <td className="font-mono">{student.id}</td>
                                        <td>
                                            <div className="student-name-cell">
                                                <div className="avatar-small" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>{student.name.charAt(0)}</div>
                                                <span>{student.name}</span>
                                            </div>
                                        </td>
                                        <td>{student.grade}</td>
                                        <td>
                                            <div className="contact-cell">
                                                <span><Mail size={14} /> {student.email}</span>
                                                <span><Phone size={14} /> {student.phone}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${student.status.toLowerCase()}`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                <button title="Edit" className="action-btn edit" onClick={() => handleEdit(student)}><Edit size={16} /></button>
                                                <button title="Delete" className="action-btn delete" onClick={() => handleDelete(student.id)}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredStudents.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                            No students found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {!loading && (
                    <div className="table-pagination">
                        <p>Showing 1 to {filteredStudents.length} of {students.length} entries</p>
                        <div className="pagination-btns">
                            <button disabled>Previous</button>
                            <button className="active">1</button>
                            <button>Next</button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Modal for Add/Edit */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <Card className="modal-card" title={editingStudent ? "Edit Student" : "Add New Student"}>
                        <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                            <X size={20} />
                        </button>
                        <form onSubmit={handleSubmit} className="student-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Student Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Grade</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.grade}
                                        onChange={e => setFormData({ ...formData, grade: e.target.value })}
                                        placeholder="e.g. 10A"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+1 234..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">
                                    <Save size={18} />
                                    <span>{editingStudent ? "Update Student" : "Create Student"}</span>
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

export default Students;
