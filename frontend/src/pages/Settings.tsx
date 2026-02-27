import { useState } from 'react';
import Card from '../components/Card';
import { Palette, Moon, Sun, Monitor, CheckCircle2, ShieldCheck, BellRing, Database, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import './Settings.css';

const Settings = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'normal');
    const [downloading, setDownloading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const themes = [
        { id: 'normal', name: 'Normal Mode', description: 'Original glassmorphic dark theme.', icon: <Monitor size={20} />, class: 'preview-normal' },
        { id: 'dark', name: 'Dark Mode', description: 'Deep black for high contrast.', icon: <Moon size={20} />, class: 'preview-dark' },
        { id: 'light', name: 'Light Mode', description: 'Clean and bright professional look.', icon: <Sun size={20} />, class: 'preview-light' }
    ];

    const applyTheme = (themeId: string) => {
        setTheme(themeId);
        localStorage.setItem('theme', themeId);

        document.body.classList.remove('light-mode', 'dark-mode');
        if (themeId === 'light') document.body.classList.add('light-mode');
        if (themeId === 'dark') document.body.classList.add('dark-mode');

        showNotification(`${themeId.charAt(0).toUpperCase() + themeId.slice(1)} Mode applied!`);
    };

    const handleDownloadPDF = () => {
        setDownloading(true);
        showNotification("Generating System Report PDF...", "success");

        // Data for the PDF
        const data = {
            date: new Date().toLocaleDateString(),
            students: [
                { id: "STU001", name: "James Wilson", grade: "10A", attendance: "94%" },
                { id: "STU002", name: "Emma Thompson", grade: "10A", attendance: "98%" },
                { id: "STU003", name: "Michael Chen", grade: "11B", attendance: "91%" }
            ],
            teachers: [
                { name: "Prof. Anderson", subject: "Mathematics", status: "Active" },
                { name: "Dr. Roberts", subject: "Physics", status: "Active" }
            ],
            metrics: {
                totalStudents: 1284,
                activeCourses: 42,
                staffCount: 86,
                avgAttendance: "92%"
            }
        };

        // Create a hidden print area and trigger print
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Chart System Backup - ${data.date}</title>
                        <style>
                            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; padding: 40px; }
                            .header { border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
                            .header h1 { color: #6366f1; margin: 0; font-size: 28px; }
                            .meta { color: #666; font-size: 14px; }
                            .section { margin-bottom: 30px; }
                            .section-title { font-size: 18px; font-weight: bold; border-left: 4px solid #6366f1; padding-left: 10px; margin-bottom: 15px; background: #f8fafc; padding-top: 5px; padding-bottom: 5px; }
                            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
                            th { background-color: #f1f5f9; color: #475569; font-weight: 600; }
                            .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
                            .stat-box { background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center; }
                            .stat-val { display: block; font-size: 20px; font-weight: bold; color: #6366f1; }
                            .stat-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
                            @media print {
                                .no-print { display: none; }
                                body { padding: 20px; }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <div>
                                <h1>Chart System Report</h1>
                                <p>Educational Management Platform Backup</p>
                            </div>
                            <div class="meta">
                                <strong>Generated:</strong> ${data.date}<br>
                                <strong>Status:</strong> System OK
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">Key Performance Indicators</div>
                            <div class="stats-grid">
                                <div class="stat-box"><span class="stat-val">${data.metrics.totalStudents}</span><span class="stat-label">Total Students</span></div>
                                <div class="stat-box"><span class="stat-val">${data.metrics.activeCourses}</span><span class="stat-label">Active Courses</span></div>
                                <div class="stat-box"><span class="stat-val">${data.metrics.staffCount}</span><span class="stat-label">Staff Members</span></div>
                                <div class="stat-box"><span class="stat-val">${data.metrics.avgAttendance}</span><span class="stat-label">Avg Attendance</span></div>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">Student Overview (Sample)</div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Grade</th>
                                        <th>Attendance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.students.map(s => `
                                        <tr>
                                            <td>${s.id}</td>
                                            <td>${s.name}</td>
                                            <td>${s.grade}</td>
                                            <td>${s.attendance}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>

                        <div class="section">
                            <div class="section-title">Faculty Summary</div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Teacher Name</th>
                                        <th>Subject</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.teachers.map(t => `
                                        <tr>
                                            <td>${t.name}</td>
                                            <td>${t.subject}</td>
                                            <td>${t.status}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>

                        <div class="footer" style="margin-top: 50px; text-align: center; font-size: 12px; color: #94a3b8;">
                            © ${new Date().getFullYear()} Chart. Internal use only.
                        </div>

                        <script>
                            window.onload = function() {
                                window.print();
                                // Close window after print dialog is closed
                                window.onafterprint = function() {
                                    window.close();
                                };
                            }
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
            setDownloading(false);
            showNotification("PDF Export ready. Use 'Save as PDF' in the print dialog.", "success");
        } else {
            showNotification("Pop-up blocked! Please allow pop-ups to download the PDF.", "error");
            setDownloading(false);
        }
    };

    return (
        <div className="settings-page">
            <div className="page-header">
                <div>
                    <h1>System Settings</h1>
                    <p>Configure theme, workspace, and security preferences.</p>
                </div>
            </div>

            <div className="settings-grid">
                <Card className="settings-section">
                    <h3><Palette size={18} /> Appearance & Themes</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                        Choose a visual style that best suits your working environment.
                    </p>

                    <div className="theme-options">
                        {themes.map(t => (
                            <div
                                key={t.id}
                                className={`theme-card ${theme === t.id ? 'active' : ''}`}
                                onClick={() => applyTheme(t.id)}
                            >
                                <div className={`theme-preview ${t.class}`}>
                                    {t.icon}
                                </div>
                                <div className="theme-info">
                                    <h4>{t.name}</h4>
                                    <p>{t.description}</p>
                                </div>
                                {theme === t.id && <CheckCircle2 className="check-mark" size={18} />}
                            </div>
                        ))}
                    </div>
                </Card>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Card title="Security & Access" className="settings-section">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem' }}>
                                <ShieldCheck size={20} color="var(--success)" />
                                <div>
                                    <h5 style={{ margin: 0 }}>Two-Factor Authentication</h5>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enabled - Protects your admin account.</p>
                                </div>
                            </div>
                            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Manage Security</button>
                        </div>
                    </Card>

                    <Card title="Notifications" className="settings-section">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem' }}>
                                <BellRing size={20} color="var(--primary)" />
                                <div>
                                    <h5 style={{ margin: 0 }}>Desktop Notifications</h5>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active - Get real-time attendance alerts.</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="System Data" className="settings-section">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem' }}>
                                <Database size={20} color="var(--warning)" />
                                <div>
                                    <h5 style={{ margin: 0 }}>Backup Status</h5>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Daily automatic backup: OK</p>
                                </div>
                            </div>
                            <button
                                className="btn-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                                onClick={handleDownloadPDF}
                                disabled={downloading}
                            >
                                <FileText size={18} />
                                <span>{downloading ? 'Preparing Report...' : 'Download PDF Report'}</span>
                            </button>
                        </div>
                    </Card>
                </div>
            </div>

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

export default Settings;
