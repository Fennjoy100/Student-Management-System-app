import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../components/Card';
import { Save, ChevronRight, FileText, Calendar, Plus, Edit2, Trash2, X, UserPlus, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import './Grades.css';

interface StudentGrade {
    id: string;
    name: string;
    Mathematics: number;
    Science: number;
    English: number;
    History: number;
    Physics: number;
}

const Grades = () => {
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedGrade, setSelectedGrade] = useState('10A');
    const [selectedTerm, setSelectedTerm] = useState('First Term');
    const [saving, setSaving] = useState(false);

    // Notification State
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; title: string; text: string; onConfirm: () => void } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const triggerConfirm = (title: string, text: string, onConfirm: () => void) => {
        setConfirmDialog({ isOpen: true, title, text, onConfirm });
    };

    // CRUD State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<StudentGrade | null>(null);
    const [formData, setFormData] = useState({ id: '', name: '' });

    const subjects = ['Mathematics', 'Science', 'English', 'History', 'Physics'];

    const initialStudents: StudentGrade[] = [
        { id: 'STU001', name: 'James Wilson', Mathematics: 0, Science: 0, English: 0, History: 0, Physics: 0 },
        { id: 'STU002', name: 'Emma Thompson', Mathematics: 0, Science: 0, English: 0, History: 0, Physics: 0 },
    ];

    const [gradeData, setGradeData] = useState<StudentGrade[]>(initialStudents);

    useEffect(() => {
        const query = searchParams.get('search');
        if (query) setSearchTerm(query);
    }, [searchParams]);

    useEffect(() => {
        fetchGrades();
    }, [selectedDate, selectedGrade, selectedTerm]);

    const fetchGrades = async () => {
        try {
            const response = await fetch(`/api/grades/?date=${selectedDate}&grade=${selectedGrade}&term=${selectedTerm}`);
            const data = await response.json();
            if (data && data.length > 0) {
                setGradeData(data);
            } else {
                setGradeData(initialStudents);
            }
        } catch (error) {
            console.error("Error fetching grades:", error);
            setGradeData(initialStudents);
        }
    };

    const handleGradeChange = (studentId: string, subject: string, value: string) => {
        const numValue = Math.min(100, Math.max(0, parseInt(value) || 0));
        setGradeData(prev => prev.map(student => {
            if (student.id === studentId) {
                return { ...student, [subject]: numValue };
            }
            return student;
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/grades/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: selectedDate,
                    grade: selectedGrade,
                    term: selectedTerm,
                    students: gradeData
                })
            });
            if (response.ok) {
                showNotification(`All findings for ${selectedDate} saved successfully!`);
            }
        } catch (error) {
            console.error('Error saving grades:', error);
            showNotification('Failed to save grades. Please try again.', 'error');
        } finally {
            setSaving(false);
        }
    };

    // CRUD Handlers
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.id || !formData.name) return;

        if (editingStudent) {
            setGradeData(prev => prev.map(s =>
                s.id === editingStudent.id ? { ...s, id: formData.id, name: formData.name } : s
            ));
            showNotification('Student information updated');
        } else {
            const newStudent: StudentGrade = {
                id: formData.id,
                name: formData.name,
                Mathematics: 0, Science: 0, English: 0, History: 0, Physics: 0
            };
            setGradeData(prev => [...prev, newStudent]);
            showNotification('Student added to gradebook');
        }
        setIsModalOpen(false);
        setEditingStudent(null);
        setFormData({ id: '', name: '' });
    };

    const openEditModal = (student: StudentGrade) => {
        setEditingStudent(student);
        setFormData({ id: student.id, name: student.name });
        setIsModalOpen(true);
    };

    const deleteStudent = (id: string) => {
        triggerConfirm(
            'Remove Student?',
            'Are you sure you want to remove this student from the gradebook? This will clear their marks for this specific date.',
            () => {
                setGradeData(prev => prev.filter(s => s.id !== id));
                showNotification('Student removed from sheet');
                setConfirmDialog(null);
            }
        );
    };

    return (
        <div className="grades-page">
            <div className="page-header">
                <div>
                    <h1>Gradebook</h1>
                    <p>Track student performance across all subjects.</p>
                </div>
                <div className="header-btns">
                    <button className="btn-success" onClick={() => { setEditingStudent(null); setFormData({ id: '', name: '' }); setIsModalOpen(true); }}>
                        <Plus size={18} />
                        <span>Add Student</span>
                    </button>
                    <button className="btn-primary" onClick={handleSave} disabled={saving}>
                        <Save size={18} />
                        <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
                    </button>
                </div>
            </div>

            <div className="grades-filters">
                <Card className="filter-card">
                    <div className="filter-inner">
                        <div className="filter-group">
                            <label><Calendar size={12} style={{ marginRight: '4px' }} /> Select Date</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="filter-input"
                            />
                        </div>
                        <div className="filter-group">
                            <label>Select Grade</label>
                            <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)}>
                                <option value="10A">Grade 10A</option>
                                <option value="10B">Grade 10B</option>
                                <option value="11A">Grade 11A</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Term / Period</label>
                            <select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)}>
                                <option>First Term</option>
                                <option>Mid Term</option>
                                <option>Final Term</option>
                            </select>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="grades-table-card">
                <div className="grades-table-container">
                    <table className="grades-table">
                        <thead>
                            <tr>
                                <th>Student Names</th>
                                {subjects.map(s => <th key={s}>{s}</th>)}
                                <th>Average</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gradeData
                                .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(student => {
                                    const total = subjects.reduce((acc, sub) => acc + (student as any)[sub], 0);
                                    const avg = Math.round(total / subjects.length);

                                    return (
                                        <tr key={student.id}>
                                            <td className="student-cell">
                                                <div className="student-info">
                                                    <span className="stu-id-small">{student.id}</span>
                                                    <span className="stu-name-bold">{student.name}</span>
                                                </div>
                                            </td>
                                            {subjects.map(sub => {
                                                const val = (student as any)[sub];
                                                const statusClass = val >= 80 ? 'high' : val >= 50 ? 'mid' : val > 0 ? 'low' : '';

                                                return (
                                                    <td key={sub}>
                                                        <input
                                                            type="number"
                                                            className={`grade-input ${statusClass}`}
                                                            value={val || ''}
                                                            onChange={(e) => handleGradeChange(student.id, sub, e.target.value)}
                                                            min="0"
                                                            max="100"
                                                        />
                                                    </td>
                                                );
                                            })}
                                            <td>
                                                <span className={`avg-badge ${avg >= 80 ? 'high' : avg >= 50 ? 'mid' : 'low'}`}>
                                                    {avg}%
                                                </span>
                                            </td>
                                            <td>
                                                <div className="table-actions-cell">
                                                    <button className="action-btn edit" onClick={() => openEditModal(student)}>
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button className="action-btn delete" onClick={() => deleteStudent(student.id)}>
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Modal for Add/Edit Student */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <Card className="modal-card" title={editingStudent ? "Edit Student" : "Add Student to Record"}>
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
                                    <span>{editingStudent ? 'Update' : 'Add to Sheet'}</span>
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

            {/* Glowing toast notification */}
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

export default Grades;
