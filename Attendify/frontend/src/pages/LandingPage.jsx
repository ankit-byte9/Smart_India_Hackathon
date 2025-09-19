import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Attendify</h1>
        <p>Smart Attendance Management System</p>
      </header>
      
      <main className="landing-main">
        <div className="welcome-section">
          <h2>Welcome to Attendify</h2>
          <p>
            A modern, AI-powered attendance tracking system using facial recognition technology.
            Choose your role to get started:
          </p>
        </div>
        
        <div className="login-options">
          <div className="login-card">
            <h3>Administrator</h3>
            <p>Manage teachers, students, and system settings</p>
            <Link to="/admin/login" className="login-btn admin-btn">
              Admin Login
            </Link>
          </div>
          
          <div className="login-card">
            <h3>Teacher</h3>
            <p>Take attendance and view student records</p>
            <Link to="/teacher/login" className="login-btn teacher-btn">
              Teacher Login
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="landing-footer">
        <p>&copy; 2024 Attendify. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;