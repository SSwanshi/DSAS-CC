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
  font-family: 'Poppins', sans-serif;
  background: #f0f4f8;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.loading {
  font-size: 1.2rem;
  color: #3498db;
  font-weight: 500;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  border-radius: 15px;
  color: white;
}

.welcome-section h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  opacity: 0.85;
}

.specialization {
  font-size: 1rem;
  font-weight: 600;
  color: #ffeaa7;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(0,0,0,0.15);
}

.stat-icon {
  font-size: 3rem;
  min-width: 80px;
  text-align: center;
}

.stat-content h3 {
  margin-bottom: 1rem;
  font-size: 1.3rem;
  color: #2d3436;
}

.patient-count, .activity-count {
  font-size: 2rem;
  font-weight: 700;
  color: #00b894;
}

.patient-label, .activity-label {
  color: #636e72;
}

.search-status {
  color: #0984e3;
  font-weight: 600;
}

.search-label {
  color: #636e72;
}

.quick-actions {
  margin-bottom: 3rem;
}

.quick-actions h2 {
  color: #2d3436;
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
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  font-weight: 500;
}

.action-btn.primary {
  background: linear-gradient(135deg, #00b894, #00cec9);
  color: white;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #00cec9, #00b894);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 200, 201, 0.3);
}

.action-btn.secondary {
  background: #ffeaa7;
  color: #2d3436;
}

.action-btn.secondary:hover {
  background: #fdcb6e;
  transform: translateY(-2px);
}

.recent-patients, .recent-activity {
  margin-bottom: 3rem;
}

.recent-patients h2, .recent-activity h2 {
  color: #2d3436;
  margin-bottom: 1.5rem;
  text-align: center;
}

.patients-list, .records-list {
  display: grid;
  gap: 1rem;
}

.patient-card, .record-item {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.patient-card:hover, .record-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.12);
}

.patient-info h4 {
  margin: 0 0 0.5rem 0;
  color: #2d3436;
}

.patient-email, .patient-phone, .record-patient, .record-time {
  margin: 0.25rem 0;
  color: #636e72;
  font-size: 0.9rem;
}

.view-records-btn {
  background: #0984e3;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
}

.view-records-btn:hover {
  background: #74b9ff;
  transform: translateY(-2px);
}

.no-patients, .no-records {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.no-patients-icon, .no-records-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-patients h3, .no-records h3 {
  color: #2d3436;
  margin-bottom: 0.5rem;
}

.no-patients p, .no-records p {
  color: #636e72;
}

      `}</style>
      </div>
    </ApprovalMessage>
  );
};

export default DoctorHomePage;
