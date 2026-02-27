import { useState } from 'react';
import Card from '../components/Card';
import { Calendar, CheckCircle2, XCircle, AlertCircle, Save } from 'lucide-react';
import './Attendance.css';

const Attendance = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const students = [
        { id: 'STU001', name: 'James Wilson', grade: '10A', status: 'present' },
        { id: 'STU002', name: 'Emma Thompson', grade: '10A', status: 'present' },
        { id: 'STU003', name: 'Robert Davis', grade: '10A', status: 'absent' },
        { id: 'STU004', name: 'Olivia Martinez', grade: '10A', status: 'late' },
        { id: 'STU005', name: 'William Taylor', grade: '10A', status: 'present' },
    ];

    return (
        <div className="attendance-page">
            <div className="page-header">
                <div>
                    <h1>Attendance Tracking</h1>
                    <p>Mark and review daily attendance records.</p>
                </div>
                <button className="btn-primary">
                    <Save size={18} />
                    <span>Save Attendance</span>
                </button>
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
                            <select defaultValue="10A">
                                <option value="10A">Grade 10A</option>
                                <option value="10B">Grade 10B</option>
                            </select>
                        </div>
                        <div className="attendance-stats-brief">
                            <div className="stat-brief">
                                <span className="dot present"></span>
                                <span>Present: 18</span>
                            </div>
                            <div className="stat-brief">
                                <span className="dot absent"></span>
                                <span>Absent: 2</span>
                            </div>
                            <div className="stat-brief">
                                <span className="dot late"></span>
                                <span>Late: 1</span>
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
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id}>
                                    <td className="student-info-cell">
                                        <span className="stu-id">{student.id}</span>
                                        <span className="stu-name">{student.name}</span>
                                    </td>
                                    <td>
                                        <div className="status-options">
                                            <button className={`status-opt present ${student.status === 'present' ? 'active' : ''}`}>
                                                <CheckCircle2 size={16} /> Present
                                            </button>
                                            <button className={`status-opt absent ${student.status === 'absent' ? 'active' : ''}`}>
                                                <XCircle size={16} /> Absent
                                            </button>
                                            <button className={`status-opt late ${student.status === 'late' ? 'active' : ''}`}>
                                                <AlertCircle size={16} /> Late
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <input type="text" placeholder="Add a note..." className="remark-input" />
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

export default Attendance;
