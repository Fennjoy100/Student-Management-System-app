import React from 'react';
import './Login.css';

const Login = () => {
    return (
        <div className="login-container">
            <div className="login-card fade-in">
                <div className="login-header">
                    <div className="logo-large">S</div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to your EduFlow account</p>
                </div>

                <form className="login-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="admin@eduflow.com" defaultValue="admin@eduflow.com" />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="••••••••" defaultValue="password" />
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
                    <h2>Streamline School Management</h2>
                    <p>Manage students, teachers, and grades with our all-in-one platform.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
