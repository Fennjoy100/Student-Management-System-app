import Card from '../components/Card';
import { Save, ChevronRight, FileText } from 'lucide-react';
import './Grades.css';

const Grades = () => {
    const subjects = ['Mathematics', 'Science', 'English', 'History', 'Physics'];
    const students = [
        { id: '1', name: 'James Wilson', Mathematics: 85, Science: 78, English: 92, History: 88, Physics: 82 },
        { id: '2', name: 'Emma Thompson', Mathematics: 92, Science: 95, English: 88, History: 90, Physics: 94 },
        { id: '3', name: 'Robert Davis', Mathematics: 75, Science: 82, English: 70, History: 74, Physics: 68 },
        { id: '4', name: 'Olivia Martinez', Mathematics: 88, Science: 84, English: 95, History: 82, Physics: 89 },
        { id: '5', name: 'William Taylor', Mathematics: 65, Science: 70, English: 68, History: 72, Physics: 60 },
    ];

    return (
        <div className="grades-page">
            <div className="page-header">
                <div>
                    <h1>Gradebook</h1>
                    <p>Track student performance across all subjects.</p>
                </div>
                <div className="header-btns">
                    <button className="btn-secondary">
                        <FileText size={18} />
                        <span>Generate Report</span>
                    </button>
                    <button className="btn-primary">
                        <Save size={18} />
                        <span>Save All Changes</span>
                    </button>
                </div>
            </div>

            <div className="grades-filters">
                <Card className="filter-card">
                    <div className="filter-inner">
                        <div className="filter-group">
                            <label>Select Grade</label>
                            <select defaultValue="10A">
                                <option value="10A">Grade 10A</option>
                                <option value="10B">Grade 10B</option>
                                <option value="11A">Grade 11A</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Term / Period</label>
                            <select>
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
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => {
                                const total = subjects.reduce((acc, sub) => acc + (student as any)[sub], 0);
                                const avg = Math.round(total / subjects.length);
                                return (
                                    <tr key={student.id}>
                                        <td className="student-cell">
                                            {student.name} <ChevronRight size={14} />
                                        </td>
                                        {subjects.map(sub => (
                                            <td key={sub}>
                                                <input
                                                    type="number"
                                                    className={`grade-input ${((student as any)[sub] < 70) ? 'danger' : ''}`}
                                                    defaultValue={(student as any)[sub]}
                                                />
                                            </td>
                                        ))}
                                        <td>
                                            <span className={`avg-badge ${avg > 80 ? 'high' : avg > 70 ? 'mid' : 'low'}`}>
                                                {avg}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Grades;
