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
  /* --- Global Variables and Base Setup --- */
  :root {
    --primary-blue: #007bff; /* Main action color (Trust) */
    --secondary-teal: #1abc9c; /* Accent color (Health/Growth) */
    --background-light: #f4f7f9; /* Clean, light-grey background */
    --card-background: #ffffff;
    --text-dark: #34495e; /* Dark slate text */
    --text-medium: #7f8c8d;
    --shadow-subtle: 0 6px 15px rgba(0, 0, 0, 0.08);
    --shadow-hover: 0 12px 30px rgba(0, 0, 0, 0.15);
  }

  .patient-home {
    padding: 3rem 2rem; /* Increased padding */
    max-width: 1400px; /* Wider content area */
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 4rem; /* Increased gap */
    background: var(--background-light);
    font-family: 'Inter', 'Poppins', sans-serif; /* Modern font stack */
  }

  /* --- Loading State Improvement --- */
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70vh; /* More prominent loading area */
  }

  .loading {
    font-size: 1.5rem;
    color: var(--text-medium);
    animation: pulse 1.5s infinite; /* Added a subtle animation */
  }

  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }

  /* --- Stats Grid & Card Improvements (Dynamic Appearance) --- */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2.5rem; /* Better spacing */
  }

  .stat-card {
    background: var(--card-background);
    border-radius: 20px; /* More rounded corners */
    padding: 2.5rem; /* Increased padding */
    box-shadow: var(--shadow-subtle);
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Aligned content to start for a modern layout */
    text-align: left;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    position: relative;
    overflow: hidden;
  }

  .stat-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-hover);
  }
  
  /* Background gradient for the first card (Accent) */
  .stats-grid > :nth-child(1) {
    background: linear-gradient(135deg, var(--primary-blue), #0056b3);
    color: white;
  }
  /* Background gradient for the second card (Accent) */
  .stats-grid > :nth-child(2) {
    background: linear-gradient(135deg, var(--secondary-teal), #16a085);
    color: white;
  }
  
  /* Reset white cards for general appearance */
  .stats-grid > :nth-child(3), .stats-grid > :nth-child(4) {
      background: var(--card-background);
      color: var(--text-dark);
  }

  .stat-icon {
    font-size: 2.5rem; /* Slightly smaller, more refined icon size */
    margin-bottom: 1.5rem;
    padding: 0.5rem;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.15); /* Light background for icons on colored cards */
    line-height: 1;
  }
  
  /* Icon colors for white cards */
  .stats-grid > :nth-child(3) .stat-icon { color: #f39c12; background: #fff8e1; }
  .stats-grid > :nth-child(4) .stat-icon { color: #8e44ad; background: #f3e5f5; }

  .stat-content {
      width: 100%;
  }
  
  .stat-content h3 {
    color: inherit; /* Inherit white for colored cards */
    margin-bottom: 0.5rem;
    font-size: 1.6rem; /* Larger title */
    font-weight: 700;
  }
  
  /* Doctor Card (Colored) */
  .stats-grid > :nth-child(1) .doctor-name,
  .stats-grid > :nth-child(1) .doctor-specialty,
  .stats-grid > :nth-child(1) .doctor-contact {
    color: rgba(255, 255, 255, 0.9);
  }
  .stats-grid > :nth-child(1) .doctor-specialty {
      font-weight: 600;
  }

  /* Records Card (Colored) */
  .record-count {
    font-size: 3rem; /* Larger, more impactful number */
    font-weight: 800;
    color: #fff; /* White count on colored background */
    margin-bottom: 0.5rem;
  }

  .record-label,
  .security-label {
    color: rgba(255, 255, 255, 0.7); /* Lighter text on colored background */
    font-size: 1rem;
    font-weight: 500;
  }

  /* Security Card (White) */
  .security-status {
    color: var(--secondary-teal); /* Use accent color for success */
    font-weight: 700;
    font-size: 1.2rem;
    margin-top: 0.5rem;
  }
  
  .no-doctor {
      color: #ffdd77; /* Softer warning color on dark background */
      font-style: normal;
  }
  
  /* --- Quick Actions (Focus and Clarity) --- */
  .quick-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .quick-actions h2, .recent-activity h2 {
    color: var(--text-dark);
    font-size: 1.8rem;
    font-weight: 700;
    border-bottom: 3px solid var(--primary-blue); /* Underline focus */
    padding-bottom: 0.5rem;
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    width: 100%;
  }

  .action-btn {
    padding: 1rem 2.5rem;
    border: 2px solid transparent; /* Prepare for border hover */
    border-radius: 12px;
    font-size: 1.05rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    min-width: 240px;
    font-weight: 600;
  }

  .action-btn.primary {
    background: var(--primary-blue);
    color: #fff;
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
  }

  .action-btn.primary:hover {
    background: #0056b3;
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 123, 255, 0.4);
  }

  .action-btn.secondary {
    background: var(--card-background);
    color: var(--text-dark);
    border-color: #ddd;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  }

  .action-btn.secondary:hover {
    background: var(--background-light);
    border-color: var(--primary-blue);
    color: var(--primary-blue);
    transform: translateY(-3px);
  }

  /* --- Recent Activity (Elevated List) --- */
  .recent-activity {
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
  }

  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .activity-item {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.2rem 2rem;
    border-radius: 15px;
    background: var(--card-background);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
    border-left: 5px solid var(--secondary-teal); /* Subtle visual anchor */
  }

  .activity-item:hover {
    transform: translateX(5px); /* Slide slightly on hover */
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }

  .activity-icon {
    font-size: 1.8rem;
    color: var(--secondary-teal);
    min-width: 40px;
    text-align: center;
  }
  
  /* Different icon colors based on activity type (needs to be applied in JSX) */
  /* .activity-item.upload .activity-icon { color: #f39c12; } */
  /* .activity-item.view .activity-icon { color: var(--primary-blue); } */

  .activity-content p {
    margin: 0;
    color: var(--text-dark);
    font-weight: 600;
    font-size: 1.05rem;
  }

  .activity-time {
    color: var(--text-medium);
    font-size: 0.9rem;
    font-weight: 400;
  }
  
  /* --- Responsiveness --- */
  @media (max-width: 768px) {
    .patient-home {
      padding: 2rem 1rem;
      gap: 3rem;
    }
    .stats-grid {
      gap: 1.5rem;
    }
    .stat-card {
        padding: 2rem;
    }
    .stat-card,
    .activity-item {
      text-align: center;
      align-items: center;
    }
    .stat-content h3 {
        text-align: center;
    }
    .action-buttons {
      flex-direction: column;
      align-items: center;
    }
    .action-btn {
      min-width: 80%;
    }
    .recent-activity {
        padding: 0 1rem;
    }
  }
`}</style>
      </div>
    </ApprovalMessage>
  );
};

export default PatientHomePage;
