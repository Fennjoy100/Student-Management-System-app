import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../components/Card';
import { Search, Plus, Filter, BookOpen, Edit2, Trash2, X, Save, Clock, User, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import './Students.css';

interface Course {
    id: string;
    name: string;
    teacher: string;
    students: number;
    schedule: string;
    status: string;
}

const Courses = () => {
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [formData, setFormData] = useState<Partial<Course>>({
        id: '',
        name: '',
        teacher: '',
        students: 0,
        schedule: '',
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
        fetchCourses();
    }, [searchParams]);

    const fetchCourses = async () => {
        try {
            const response = await fetch('/api/courses');
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error("Error fetching courses:", error);
            showNotification('Failed to load courses', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (courseId: string) => {
        triggerConfirm(
            'Delete Course?',
            'Are you sure you want to remove this course? This will remove it from all student schedules.',
            async () => {
                try {
                    await fetch(`/api/courses/${courseId}`, { method: 'DELETE' });
                    fetchCourses();
                    showNotification('Course deleted successfully');
                } catch (error) {
                    console.error("Error deleting course:", error);
                    showNotification('Failed to delete course', 'error');
                }
                setConfirmDialog(null);
            }
        );
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingCourse ? `/api/courses/${editingCourse.id}` : '/api/courses/';
        const method = editingCourse ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setIsModalOpen(false);
                setEditingCourse(null);
                setFormData({ id: '', name: '', teacher: '', students: 0, schedule: '', status: 'Active' });
                fetchCourses();
                showNotification(editingCourse ? 'Course updated successfully' : 'New course created successfully');
            }
        } catch (error) {
            console.error("Error saving course:", error);
            showNotification('Error saving course details', 'error');
        }
    };

    const openEditModal = (course: Course) => {
        setEditingCourse(course);
        setFormData(course);
        setIsModalOpen(true);
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || course.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="students-page">
            <div className="page-header">
                <div>
                    <h1>Courses & Classes</h1>
                    <p>Manage school curriculum and session schedules.</p>
                </div>
                <button className="btn-success" onClick={() => { setEditingCourse(null); setFormData({ id: '', name: '', teacher: '', students: 0, schedule: '', status: 'Active' }); setIsModalOpen(true); }}>
                    <Plus size={18} />
                    <span>Create Course</span>
                </button>
            </div>

            <Card className="table-card">
                <div className="table-actions">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <Filter size={18} />
                        <select
                            className="filter-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Course Name</th>
                                <th>Teacher</th>
                                <th>Students</th>
                                <th>Schedule</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Loading courses...</td></tr>
                            ) : filteredCourses.map((course) => (
                                <tr key={course.id}>
                                    <td className="font-mono">{course.id}</td>
                                    <td>
                                        <div className="student-name-cell">
                                            <div className="avatar-small">
                                                <BookOpen size={16} />
                                            </div>
                                            <span>{course.name}</span>
                                        </div>
                                    </td>
                                    <td>{course.teacher}</td>
                                    <td>{course.students}</td>
                                    <td>{course.schedule}</td>
                                    <td>
                                        <span className={`status-badge ${course.status.toLowerCase()}`}>
                                            {course.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions-cell" style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="action-btn edit" onClick={() => openEditModal(course)}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="action-btn delete" onClick={() => handleDelete(course.id)}>
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

            {/* Course Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <Card className="modal-card" title={editingCourse ? "Edit Course" : "Create New Course"}>
                        <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                            <X size={20} />
                        </button>
                        <form onSubmit={handleSave} className="student-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Course ID</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.id}
                                        onChange={e => setFormData({ ...formData, id: e.target.value })}
                                        placeholder="e.g. CRS001"
                                        disabled={!!editingCourse}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Course Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter course name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Teacher</label>
                                    <div className="input-with-icon">
                                        <User size={16} />
                                        <input
                                            type="text"
                                            required
                                            value={formData.teacher}
                                            onChange={e => setFormData({ ...formData, teacher: e.target.value })}
                                            placeholder="Assign teacher"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Schedule</label>
                                    <div className="input-with-icon">
                                        <Clock size={16} />
                                        <input
                                            type="text"
                                            required
                                            value={formData.schedule}
                                            onChange={e => setFormData({ ...formData, schedule: e.target.value })}
                                            placeholder="e.g. Mon, Wed 09:00"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Number of Students</label>
                                    <input
                                        type="number"
                                        value={formData.students}
                                        onChange={e => setFormData({ ...formData, students: parseInt(e.target.value) || 0 })}
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
                                    <span>{editingCourse ? 'Update Course' : 'Create Course'}</span>
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

export default Courses;
