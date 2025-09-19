import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './LoginPage.css';

const TeacherLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, setIsLoading, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Demo mode for testing - use 'demo' as both username and password
    if (username === 'demo' && password === 'demo') {
      login({ username: 'Demo Teacher', role: 'teacher' }, 'demo-token');
      navigate('/teacher/dashboard');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.teacherLogin(username, password);
      login({ username, role: 'teacher' }, response.access_token);
      navigate('/teacher/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again. (Try username: demo, password: demo for demo mode)');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Teacher Login</h1>
          <p>Access your teacher dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="demo-info">
            <p><strong>Demo Mode:</strong> Use username "demo" and password "demo" to test the dashboard</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter 'demo' for demo mode"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter 'demo' for demo mode"
            />
          </div>

          <button type="submit" className="login-button teacher-login" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login as Teacher'}
          </button>
        </form>

        <div className="login-footer">
          <Link to="/" className="back-link">← Back to Home</Link>
          <span>or</span>
          <Link to="/admin/login" className="switch-link">Admin Login</Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;