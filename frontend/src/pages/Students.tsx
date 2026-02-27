import React, { useState } from 'react';
import Card from '../components/Card';
import { Search, Plus, Filter, MoreVertical, Edit, Trash2, Mail, Phone } from 'lucide-react';
import './Students.css';

const Students = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const students = [
        { id: 'STU001', name: 'James Wilson', grade: '10A', email: 'james.w@example.com', phone: '+1 234 567 890', status: 'Active' },
        { id: 'STU002', name: 'Emma Thompson', grade: '10A', email: 'emma.t@example.com', phone: '+1 234 567 891', status: 'Active' },
        { id: 'STU003', name: 'Robert Davis', grade: '11B', email: 'robert.d@example.com', phone: '+1 234 567 892', status: 'Inactive' },
        { id: 'STU004', name: 'Olivia Martinez', grade: '09C', email: 'olivia.m@example.com', phone: '+1 234 567 893', status: 'Active' },
        { id: 'STU005', name: 'William Taylor', grade: '12D', email: 'william.t@example.com', phone: '+1 234 567 894', status: 'Active' },
    ];

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="students-page">
            <div className="page-header">
                <div>
                    <h1>Students Management</h1>
                    <p>Manage, add, and update student records.</p>
                </div>
                <button className="btn-primary">
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
                                            <div className="avatar-small">{student.name.charAt(0)}</div>
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

                <div className="table-pagination">
                    <p>Showing 1 to {filteredStudents.length} of {students.length} entries</p>
                    <div className="pagination-btns">
                        <button disabled>Previous</button>
                        <button className="active">1</button>
                        <button>2</button>
                        <button>Next</button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Students;
