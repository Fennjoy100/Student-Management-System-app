import React, { useState } from 'react';
import Card from '../components/Card';
import { Search, Plus, Filter, MoreVertical, Edit, Trash2, Mail, Book } from 'lucide-react';
import './Students.css'; // Reusing Students CSS for consistency

const Teachers = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const teachers = [
        { id: 'TEA001', name: 'Dr. Sarah Smith', subject: 'Mathematics', email: 'sarah.s@example.com', classes: '10A, 11B', status: 'Active' },
        { id: 'TEA002', name: 'Prof. Michael Brown', subject: 'Physics', email: 'michael.b@example.com', classes: '12C, 12D', status: 'Active' },
        { id: 'TEA003', name: 'Ms. Emily White', subject: 'English', email: 'emily.w@example.com', classes: '09A, 10B', status: 'On Leave' },
        { id: 'TEA004', name: 'Mr. David Wilson', subject: 'History', email: 'david.w@example.com', classes: '11C', status: 'Active' },
    ];

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="students-page">
            <div className="page-header">
                <div>
                    <h1>Teachers Management</h1>
                    <p>Manage faculty members and their assignments.</p>
                </div>
                <button className="btn-primary">
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
                    <button className="btn-secondary">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                </div>

                <div className="table-container">
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
                                            <div className="avatar-small" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                                                {teacher.name.charAt(4)}
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
                                            <button title="Edit"><Edit size={16} /></button>
                                            <button title="Delete" className="text-danger"><Trash2 size={16} /></button>
                                            <button title="More"><MoreVertical size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Teachers;
