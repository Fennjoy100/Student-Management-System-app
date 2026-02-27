import { useState } from 'react';
import { User, Mail, MapPin, Phone, Shield, Calendar, Edit2, CheckCircle, Save, Camera } from 'lucide-react';
import Card from '../components/Card';
import './Settings.css'; // Reusing some layouts

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const [profile, setProfile] = useState({
        name: 'Admin User',
        role: 'Super Admin',
        email: 'admin@chart-system.edu',
        phone: '+1 (555) 123-4567',
        location: 'California, USA',
        joined: 'January 2024',
        bio: 'Focused on optimizing student management workflows and enhancing digital learning environments.'
    });

    const handleSave = () => {
        setIsEditing(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="profile-page fade-in">
            <div className="page-header">
                <div>
                    <h1>My Profile</h1>
                    <p>Manage your account information and preferences.</p>
                </div>
                <button className={isEditing ? "btn-success" : "btn-primary"} onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
                    {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
                    <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
                </button>
            </div>

            <div className="settings-grid">
                {/* Column 1: Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Card className="profile-main-card">
                        <div className="profile-header-alt">
                            <div className="avatar-container">
                                <div className="profile-avatar-large">
                                    <User size={64} />
                                    <button className="avatar-edit-btn" title="Change Avatar">
                                        <Camera size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="profile-title-block">
                                <h2>{profile.name}</h2>
                                <span className="profile-role-badge">{profile.role}</span>
                            </div>
                        </div>

                        <div className="profile-bio-section" style={{ marginTop: '2rem' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Biography</label>
                            {isEditing ? (
                                <textarea
                                    className="profile-input-area"
                                    value={profile.bio}
                                    onChange={e => setProfile({ ...profile, bio: e.target.value })}
                                    style={{ width: '100%', marginTop: '0.5rem', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--border)', borderRadius: '8px', color: 'inherit', padding: '10px' }}
                                    rows={4}
                                />
                            ) : (
                                <p style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>{profile.bio}</p>
                            )}
                        </div>
                    </Card>

                    <Card title="Account Security">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem' }}>
                                <Shield size={20} color="var(--success)" />
                                <div>
                                    <h5 style={{ margin: 0 }}>Two-Factor Authentication</h5>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Protects your access with extra verification.</p>
                                </div>
                                <button className="btn-secondary" style={{ marginLeft: 'auto', padding: '0.4rem 0.8rem', fontSize: '12px' }}>Enable</button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Column 2: Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Card title="Contact Information">
                        <div className="profile-details-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="detail-item">
                                <div className="detail-icon"><Mail size={18} /></div>
                                <div className="detail-content">
                                    <label>Email Address</label>
                                    {isEditing ? (
                                        <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="edit-input-field" />
                                    ) : (
                                        <p>{profile.email}</p>
                                    )}
                                </div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-icon"><Phone size={18} /></div>
                                <div className="detail-content">
                                    <label>Phone Number</label>
                                    {isEditing ? (
                                        <input type="text" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="edit-input-field" />
                                    ) : (
                                        <p>{profile.phone}</p>
                                    )}
                                </div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-icon"><MapPin size={18} /></div>
                                <div className="detail-content">
                                    <label>Work Location</label>
                                    {isEditing ? (
                                        <input type="text" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} className="edit-input-field" />
                                    ) : (
                                        <p>{profile.location}</p>
                                    )}
                                </div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-icon"><Calendar size={18} /></div>
                                <div className="detail-content">
                                    <label>Joined System</label>
                                    <p>{profile.joined}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Success Toast */}
            {showToast && (
                <div className="glowing-toast success">
                    <div className="toast-icon">
                        <CheckCircle size={14} color="white" />
                    </div>
                    <span>Profile updated successfully!</span>
                </div>
            )}

            <style>{`
                .profile-header-alt {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }
                .profile-avatar-large {
                    width: 120px;
                    height: 120px;
                    background: linear-gradient(135deg, var(--primary), #818cf8);
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    position: relative;
                    box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
                }
                .avatar-edit-btn {
                    position: absolute;
                    bottom: -10px;
                    right: -10px;
                    width: 32px;
                    height: 32px;
                    background: var(--bg-card);
                    border: 2px solid var(--primary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                }
                .profile-role-badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    background: rgba(99, 102, 241, 0.1);
                    color: var(--primary);
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    margin-top: 5px;
                }
                .detail-item {
                    display: flex;
                    gap: 1rem;
                }
                .detail-icon {
                    width: 40px;
                    height: 40px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                }
                .detail-content label {
                    display: block;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    margin-bottom: 2px;
                }
                .detail-content p {
                    font-weight: 500;
                }
                .edit-input-field {
                    background: rgba(0,0,0,0.1);
                    border: 1px solid var(--border);
                    color: inherit;
                    padding: 4px 8px;
                    border-radius: 4px;
                    width: 100%;
                }

                @media (max-width: 768px) {
                    .profile-header-alt {
                        flex-direction: column;
                        text-align: center;
                    }
                    .page-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }
                    .page-header button {
                        width: 100%;
                        justify-content: center;
                    }
                    .settings-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default Profile;
