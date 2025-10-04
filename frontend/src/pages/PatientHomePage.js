// src/pages/PatientHomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/apiService';
import ApprovalMessage from '../components/common/ApprovalMessage';

const PatientHomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignedDoctor, setAssignedDoctor] = useState(null);
  const [recordsCount, setRecordsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      
      // Fetch assigned doctor
      try {
        const doctorResponse = await apiService.getAssignedDoctor();
        setAssignedDoctor(doctorResponse.data.doctor);
      } catch (error) {
        // No doctor assigned yet
        setAssignedDoctor(null);
      }

      // Fetch records count
      try {
        const recordsResponse = await apiService.getPatientRecords();
        setRecordsCount(recordsResponse.data.records.length);
      } catch (error) {
        setRecordsCount(0);
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <ApprovalMessage user={user}>
      <div className="patient-home">
      <div className="welcome-section">
        <h1>Welcome back, {user?.firstName}!</h1>
        <p className="subtitle">Your personal health data management center</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-content">
            <h3>Assigned Doctor</h3>
            {assignedDoctor ? (
              <div>
                <p className="doctor-name">Dr. {assignedDoctor.first_name} {assignedDoctor.last_name}</p>
                <p className="doctor-specialty">{assignedDoctor.specialization || 'General Practice'}</p>
                <p className="doctor-contact">{assignedDoctor.email}</p>
              </div>
            ) : (
              <p className="no-doctor">No doctor assigned yet</p>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Health Records</h3>
            <p className="record-count">{recordsCount}</p>
            <p className="record-label">Records uploaded</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔒</div>
          <div className="stat-content">
            <h3>Security Status</h3>
            <p className="security-status">All data encrypted</p>
            <p className="security-label">Maximum protection</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button 
            className="action-btn primary"
            onClick={() => navigate('/patient-dashboard')}
          >
            📤 Upload New Health Data
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => navigate('/patient-dashboard')}
          >
            📋 View My Records
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => navigate('/patient-dashboard')}
          >
            👨‍⚕️ Contact My Doctor
          </button>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recordsCount > 0 ? (
            <div className="activity-item">
              <div className="activity-icon">📄</div>
              <div className="activity-content">
                <p>You have {recordsCount} health record{recordsCount !== 1 ? 's' : ''} uploaded</p>
                <span className="activity-time">All data is securely encrypted</span>
              </div>
            </div>
          ) : (
            <div className="activity-item">
              <div className="activity-icon">ℹ️</div>
              <div className="activity-content">
                <p>No health records uploaded yet</p>
                <span className="activity-time">Start by uploading your first health data</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .patient-home {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 50vh;
        }

        .loading {
          font-size: 1.2rem;
          color: #7f8c8d;
        }

        .welcome-section {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem 0;
        }

        .welcome-section h1 {
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          font-size: 1.2rem;
          color: #7f8c8d;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-icon {
          font-size: 3rem;
          min-width: 80px;
          text-align: center;
        }

        .stat-content h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 1.3rem;
        }

        .doctor-name {
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .doctor-specialty {
          color: #3498db;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .doctor-contact {
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        .no-doctor {
          color: #e74c3c;
          font-style: italic;
        }

        .record-count {
          font-size: 2rem;
          font-weight: bold;
          color: #27ae60;
          margin-bottom: 0.5rem;
        }

        .record-label {
          color: #7f8c8d;
        }

        .security-status {
          color: #27ae60;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .security-label {
          color: #7f8c8d;
        }

        .quick-actions {
          margin-bottom: 3rem;
        }

        .quick-actions h2 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 1rem 2rem;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 200px;
        }

        .action-btn.primary {
          background: #3498db;
          color: white;
        }

        .action-btn.primary:hover {
          background: #2980b9;
          transform: translateY(-2px);
        }

        .action-btn.secondary {
          background: #ecf0f1;
          color: #2c3e50;
        }

        .action-btn.secondary:hover {
          background: #d5dbdb;
          transform: translateY(-2px);
        }

        .recent-activity h2 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .activity-list {
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid #ecf0f1;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-icon {
          font-size: 1.5rem;
          min-width: 40px;
        }

        .activity-content p {
          margin: 0;
          color: #2c3e50;
          font-weight: 500;
        }

        .activity-time {
          color: #7f8c8d;
          font-size: 0.9rem;
        }
      `}</style>
      </div>
    </ApprovalMessage>
  );
};

export default PatientHomePage;
