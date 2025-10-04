// src/pages/DoctorHomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/apiService';
import ApprovalMessage from '../components/common/ApprovalMessage';

const DoctorHomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      
      // Fetch assigned patients
      const patientsResponse = await apiService.getAssignedPatients();
      setAssignedPatients(patientsResponse.data.patients);
      setTotalPatients(patientsResponse.data.patients.length);

      // Fetch recent records (from assigned patients)
      if (patientsResponse.data.patients.length > 0) {
        try {
          const recordsResponse = await apiService.getPatientRecords(patientsResponse.data.patients[0].id);
          setRecentRecords(recordsResponse.data.records.slice(0, 3)); // Get latest 3 records
        } catch (error) {
          setRecentRecords([]);
        }
      }
    } catch (error) {
      console.error('Error fetching doctor data:', error);
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
      <div className="doctor-home">
      <div className="welcome-section">
        <h1>Welcome, Dr. {user?.lastName}!</h1>
        <p className="subtitle">Your medical practice management center</p>
        <p className="specialization">{user?.specialization || 'General Practice'}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Assigned Patients</h3>
            <p className="patient-count">{totalPatients}</p>
            <p className="patient-label">Patients under your care</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Recent Activity</h3>
            <p className="activity-count">{recentRecords.length}</p>
            <p className="activity-label">Recent health records</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div className="stat-content">
            <h3>Search Access</h3>
            <p className="search-status">All patients</p>
            <p className="search-label">Full database access</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button 
            className="action-btn primary"
            onClick={() => navigate('/doctor-dashboard')}
          >
            👥 View My Patients
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => navigate('/doctor-dashboard')}
          >
            🔍 Search All Patients
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => navigate('/doctor-dashboard')}
          >
            📋 Review Records
          </button>
        </div>
      </div>

      <div className="recent-patients">
        <h2>Your Assigned Patients</h2>
        {assignedPatients.length > 0 ? (
          <div className="patients-list">
            {assignedPatients.slice(0, 5).map(patient => (
              <div key={patient.id} className="patient-card">
                <div className="patient-info">
                  <h4>{patient.first_name} {patient.last_name}</h4>
                  <p className="patient-email">{patient.email}</p>
                  <p className="patient-phone">{patient.phone || 'No phone provided'}</p>
                </div>
                <div className="patient-actions">
                  <button className="view-records-btn">View Records</button>
                </div>
              </div>
            ))}
            {assignedPatients.length > 5 && (
              <div className="more-patients">
                <p>And {assignedPatients.length - 5} more patients...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="no-patients">
            <div className="no-patients-icon">👥</div>
            <h3>No patients assigned yet</h3>
            <p>You'll see your assigned patients here once the admin assigns them to you.</p>
          </div>
        )}
      </div>

      <div className="recent-activity">
        <h2>Recent Health Records</h2>
        {recentRecords.length > 0 ? (
          <div className="records-list">
            {recentRecords.map(record => (
              <div key={record.id} className="record-item">
                <div className="record-icon">📄</div>
                <div className="record-content">
                  <p className="record-type">{record.data_type.replace('_', ' ').toUpperCase()}</p>
                  <p className="record-patient">Patient: {record.first_name} {record.last_name}</p>
                  <span className="record-time">
                    {new Date(record.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-records">
            <div className="no-records-icon">📋</div>
            <h3>No recent records</h3>
            <p>Health records from your patients will appear here.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .doctor-home {
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
          margin-bottom: 0.5rem;
        }

        .specialization {
          font-size: 1rem;
          color: #3498db;
          font-weight: 500;
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

        .patient-count, .activity-count {
          font-size: 2rem;
          font-weight: bold;
          color: #27ae60;
          margin-bottom: 0.5rem;
        }

        .patient-label, .activity-label {
          color: #7f8c8d;
        }

        .search-status {
          color: #3498db;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .search-label {
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

        .recent-patients, .recent-activity {
          margin-bottom: 3rem;
        }

        .recent-patients h2, .recent-activity h2 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .patients-list {
          display: grid;
          gap: 1rem;
        }

        .patient-card {
          background: white;
          border-radius: 10px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .patient-info h4 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
        }

        .patient-email, .patient-phone {
          margin: 0.25rem 0;
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        .view-records-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
        }

        .more-patients {
          text-align: center;
          padding: 1rem;
          color: #7f8c8d;
          font-style: italic;
        }

        .no-patients, .no-records {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }

        .no-patients-icon, .no-records-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .no-patients h3, .no-records h3 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .no-patients p, .no-records p {
          color: #7f8c8d;
        }

        .records-list {
          display: grid;
          gap: 1rem;
        }

        .record-item {
          background: white;
          border-radius: 10px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .record-icon {
          font-size: 1.5rem;
          min-width: 40px;
        }

        .record-content p {
          margin: 0.25rem 0;
          color: #2c3e50;
        }

        .record-type {
          font-weight: bold;
        }

        .record-patient {
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        .record-time {
          color: #7f8c8d;
          font-size: 0.8rem;
        }
      `}</style>
      </div>
    </ApprovalMessage>
  );
};

export default DoctorHomePage;
