import React from 'react';
import './Login.css';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <div className="login-container">
            <div className="login-card fade-in">
                <div className="login-header">
                    <div className="logo-large">C</div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to your Chart account</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="admin@chart.edu" defaultValue="admin@chart.edu" required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="••••••••" defaultValue="password" required />
                    </div>

                    <div className="form-options">
                        <label className="checkbox-container">
                            <input type="checkbox" defaultChecked />
                            <span className="checkmark"></span>
                            Remember me
                        </label>
                        <a href="#" className="forgot-password">Forgot Password?</a>
                    </div>

                    <button type="submit" className="login-btn">Sign In</button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <a href="#">Contact School Admin</a></p>
                </div>
            </div>

            <div className="login-graphic">
                <div className="graphic-content">
                    <h2>Student Management System</h2>
                </div>
            </div>
        </div>
    );
};

export default Login;
