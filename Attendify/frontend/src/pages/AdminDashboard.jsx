import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('teacher');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Teacher registration form state
  const [teacherData, setTeacherData] = useState({
    username: '',
    password: '',
    email: '',
    full_name: ''
  });
  
  // Student registration form state
  const [studentData, setStudentData] = useState({
    name: '',
    file: null
  });

  // Placeholder attendance data
  const [attendanceRecords] = useState([
    { id: 1, studentName: 'John Doe', date: '2024-01-15', status: 'Present' },
    { id: 2, studentName: 'Jane Smith', date: '2024-01-15', status: 'Absent' },
    { id: 3, studentName: 'Mike Johnson', date: '2024-01-15', status: 'Present' },
  ]);

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      await adminAPI.registerTeacher(teacherData);
      setMessage('Teacher registered successfully!');
      setTeacherData({ username: '', password: '', email: '', full_name: '' });
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Failed to register teacher');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    if (!studentData.file) {
      setMessage('Please select a photo file');
      setIsLoading(false);
      return;
    }
    
    try {
      await adminAPI.registerStudent(studentData.name, studentData.file);
      setMessage('Student registered successfully!');
      setStudentData({ name: '', file: null });
      document.getElementById('student-file').value = '';
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Failed to register student');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrainModel = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      await adminAPI.trainModel();
      setMessage('Model training started successfully!');
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Failed to start model training');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.username}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <nav className="dashboard-nav">
          <button 
            className={`nav-btn ${activeTab === 'teacher' ? 'active' : ''}`}
            onClick={() => setActiveTab('teacher')}
          >
            Register Teacher
          </button>
          <button 
            className={`nav-btn ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => setActiveTab('student')}
          >
            Register Student
          </button>
          <button 
            className={`nav-btn ${activeTab === 'train' ? 'active' : ''}`}
            onClick={() => setActiveTab('train')}
          >
            Train Model
          </button>
          <button 
            className={`nav-btn ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance Records
          </button>
        </nav>

        <div className="dashboard-content">
          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          {activeTab === 'teacher' && (
            <div className="content-section">
              <h2>Register New Teacher</h2>
              <form onSubmit={handleTeacherSubmit} className="form">
                <div className="form-group">
                  <label htmlFor="teacher-username">Username</label>
                  <input
                    type="text"
                    id="teacher-username"
                    value={teacherData.username}
                    onChange={(e) => setTeacherData({...teacherData, username: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="teacher-password">Password</label>
                  <input
                    type="password"
                    id="teacher-password"
                    value={teacherData.password}
                    onChange={(e) => setTeacherData({...teacherData, password: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="teacher-email">Email</label>
                  <input
                    type="email"
                    id="teacher-email"
                    value={teacherData.email}
                    onChange={(e) => setTeacherData({...teacherData, email: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="teacher-fullname">Full Name</label>
                  <input
                    type="text"
                    id="teacher-fullname"
                    value={teacherData.full_name}
                    onChange={(e) => setTeacherData({...teacherData, full_name: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? 'Registering...' : 'Register Teacher'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'student' && (
            <div className="content-section">
              <h2>Register New Student</h2>
              <form onSubmit={handleStudentSubmit} className="form">
                <div className="form-group">
                  <label htmlFor="student-name">Student Name</label>
                  <input
                    type="text"
                    id="student-name"
                    value={studentData.name}
                    onChange={(e) => setStudentData({...studentData, name: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="student-file">Student Photo</label>
                  <input
                    type="file"
                    id="student-file"
                    accept="image/*"
                    onChange={(e) => setStudentData({...studentData, file: e.target.files[0]})}
                    required
                    disabled={isLoading}
                  />
                  <small>Please upload a clear photo of the student's face</small>
                </div>
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? 'Registering...' : 'Register Student'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'train' && (
            <div className="content-section">
              <h2>Train Recognition Model</h2>
              <p>Train the facial recognition model with current student data. This process may take several minutes.</p>
              <button 
                onClick={handleTrainModel} 
                className="train-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Training...' : 'Start Model Training'}
              </button>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="content-section">
              <h2>Attendance Records</h2>
              <p className="placeholder-text">
                This is a placeholder for attendance records. In a complete implementation, 
                this would show real attendance data from the database.
              </p>
              <div className="attendance-table">
                <table>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map(record => (
                      <tr key={record.id}>
                        <td>{record.studentName}</td>
                        <td>{record.date}</td>
                        <td className={`status ${record.status.toLowerCase()}`}>
                          {record.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;