import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { teacherAPI } from '../services/api';
import './Dashboard.css';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [attendanceFile, setAttendanceFile] = useState(null);
  const [attendanceResults, setAttendanceResults] = useState(null);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!attendanceFile) {
      setMessage('Please select a photo file');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    setAttendanceResults(null);
    
    try {
      const response = await teacherAPI.uploadAttendance(attendanceFile);
      setAttendanceResults(response.recognized_faces);
      setMessage('Attendance processed successfully!');
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Failed to process attendance');
      setAttendanceResults(null);
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
          <h1>Teacher Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.username}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content single-content">
          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="content-section">
            <h2>Take Attendance</h2>
            <p>Upload a photo of the class to automatically mark attendance using facial recognition.</p>
            
            <form onSubmit={handleFileUpload} className="form upload-form">
              <div className="form-group">
                <label htmlFor="attendance-file">Class Photo</label>
                <input
                  type="file"
                  id="attendance-file"
                  accept="image/*"
                  onChange={(e) => setAttendanceFile(e.target.files[0])}
                  required
                  disabled={isLoading}
                />
                <small>Please upload a clear photo of the class showing students' faces</small>
              </div>
              
              <button type="submit" className="submit-btn upload-btn" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Process Attendance'}
              </button>
            </form>
          </div>

          {attendanceResults && (
            <div className="content-section results-section">
              <h2>Attendance Results</h2>
              
              {attendanceResults.length === 0 ? (
                <p className="no-results">No students were recognized in the uploaded photo.</p>
              ) : (
                <div className="attendance-results">
                  <p className="results-summary">
                    Recognized {attendanceResults.length} student(s) in the uploaded photo:
                  </p>
                  
                  <div className="students-grid">
                    {attendanceResults.map((student, index) => (
                      <div key={index} className="student-card">
                        <div className="student-info">
                          <h3>{student.name || `Student ${index + 1}`}</h3>
                          <p className="confidence">
                            Confidence: {student.confidence ? `${(student.confidence * 100).toFixed(1)}%` : 'N/A'}
                          </p>
                          <span className="status present">Present</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="content-section placeholder-section">
            <h2>Previous Attendance Sessions</h2>
            <p className="placeholder-text">
              This is a placeholder for previous attendance sessions. In a complete implementation, 
              this would show historical attendance data with dates, times, and student lists.
            </p>
            
            <div className="placeholder-list">
              <div className="placeholder-item">
                <h4>Session: January 15, 2024 - 10:00 AM</h4>
                <p>23 students present, 2 absent</p>
              </div>
              <div className="placeholder-item">
                <h4>Session: January 12, 2024 - 10:00 AM</h4>
                <p>25 students present, 0 absent</p>
              </div>
              <div className="placeholder-item">
                <h4>Session: January 10, 2024 - 10:00 AM</h4>
                <p>24 students present, 1 absent</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;