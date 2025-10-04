// src/pages/DoctorDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/apiService';
import ApprovalMessage from '../components/common/ApprovalMessage';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'assigned-patients') {
      fetchAssignedPatients();
    } else if (activeTab === 'search-patients') {
      fetchAllPatients();
    }
  }, [activeTab]);

  const fetchAssignedPatients = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAssignedPatients();
      setAssignedPatients(response.data.patients);
    } catch (error) {
      setError('Failed to fetch assigned patients');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPatients = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllPatients();
      setAllPatients(response.data.patients);
    } catch (error) {
      setError('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const searchPatients = async () => {
    if (!searchQuery.trim()) {
      fetchAllPatients();
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.searchPatients(searchQuery);
      setAllPatients(response.data.patients);
    } catch (error) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientRecords = async (patientId) => {
    try {
      setLoading(true);
      const response = await apiService.getPatientRecords(patientId);
      setPatientRecords(response.data.records);
      setSelectedPatient(patientId);
    } catch (error) {
      setError('Failed to fetch patient records');
    } finally {
      setLoading(false);
    }
  };

  const renderHome = () => (
    <div className="dashboard-content">
      <h2>Welcome, Dr. {user?.lastName}</h2>
      <div className="welcome-cards">
        <div className="welcome-card">
          <h3>👥 Assigned Patients</h3>
          <p>View patients assigned to you</p>
          <button onClick={() => setActiveTab('assigned-patients')} className="action-button">
            View Patients
          </button>
        </div>
        <div className="welcome-card">
          <h3>🔍 Search Patients</h3>
          <p>Search and access all patient records</p>
          <button onClick={() => setActiveTab('search-patients')} className="action-button">
            Search Patients
          </button>
        </div>
      </div>
    </div>
  );

  const renderAssignedPatients = () => (
    <div className="dashboard-content">
      <h2>Your Assigned Patients</h2>
      
      {loading ? (
        <div className="loading">Loading patients...</div>
      ) : assignedPatients.length === 0 ? (
        <div className="no-patients">No patients assigned to you yet.</div>
      ) : (
        <div className="patients-list">
          {assignedPatients.map(patient => (
            <div key={patient.id} className="patient-card">
              <div className="patient-info">
                <h4>{patient.firstName} {patient.lastName}</h4>
                <p>Email: {patient.email}</p>
                <p>Phone: {patient.phone || 'Not provided'}</p>
                <p>Assigned: {patient.assigned_at ? new Date(patient.assigned_at).toLocaleDateString() : 'Recently'}</p>
              </div>
              <button 
                onClick={() => fetchPatientRecords(patient.id)}
                className="view-records-button"
              >
                View Records
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedPatient && (
        <div className="patient-records">
          <h3>Patient Records (Decrypted)</h3>
          {patientRecords.length === 0 ? (
            <p>No records found for this patient.</p>
          ) : (
            <div className="records-list">
              {patientRecords.map(record => (
                <div key={record.id} className="record-card">
                  <div className="record-header">
                    <h4>{record.dataType.replace('_', ' ').toUpperCase()}</h4>
                    <span className="record-date">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="record-content">
                    <pre>{JSON.stringify(record.decryptedData, null, 2)}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderSearchPatients = () => (
    <div className="dashboard-content">
      <h2>Search All Patients</h2>
      
      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button onClick={searchPatients} className="search-button">
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Searching...</div>
      ) : (
        <div className="patients-list">
          {allPatients.map(patient => (
            <div key={patient.id} className="patient-card">
              <div className="patient-info">
                <h4>{patient.firstName} {patient.lastName}</h4>
                <p>Email: {patient.email}</p>
                <p>Phone: {patient.phone || 'Not provided'}</p>
                <p>Specialization: {patient.specialization || 'N/A'}</p>
              </div>
              <button 
                onClick={() => fetchPatientRecords(patient.id)}
                className="view-records-button"
              >
                View Records
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedPatient && (
        <div className="patient-records">
          <h3>Patient Records (Decrypted)</h3>
          {patientRecords.length === 0 ? (
            <p>No records found for this patient.</p>
          ) : (
            <div className="records-list">
              {patientRecords.map(record => (
                <div key={record.id} className="record-card">
                  <div className="record-header">
                    <h4>{record.dataType.replace('_', ' ').toUpperCase()}</h4>
                    <span className="record-date">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="record-content">
                    <pre>{JSON.stringify(record.decryptedData, null, 2)}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <ApprovalMessage user={user}>
      <div className="doctor-dashboard">
      <div className="dashboard-sidebar">
        <div className="logo">
          <h2>DSAS</h2>
        </div>
        <nav className="dashboard-nav">
          <button 
            className={activeTab === 'home' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('home')}
          >
            🏠 Home
          </button>
          <button 
            className={activeTab === 'assigned-patients' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('assigned-patients')}
          >
            👥 Patient Details
          </button>
          <button 
            className={activeTab === 'search-patients' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('search-patients')}
          >
            🔍 Search Patient
          </button>
        </nav>
        <div className="user-info">
          <p>Dr. {user?.lastName}</p>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-main">
        {error && <div className="error-message">{error}</div>}
        {activeTab === 'home' && renderHome()}
        {activeTab === 'assigned-patients' && renderAssignedPatients()}
        {activeTab === 'search-patients' && renderSearchPatients()}
      </div>

      <style jsx>{`
        .doctor-dashboard {
          display: flex;
          min-height: 100vh;
          background: #f8f9fa;
        }

        .dashboard-sidebar {
          width: 250px;
          background: #2c3e50;
          color: white;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
        }

        .logo h2 {
          margin: 0 0 2rem 0;
          text-align: center;
          color: #3498db;
        }

        .dashboard-nav {
          flex: 1;
        }

        .nav-item {
          width: 100%;
          background: none;
          border: none;
          color: white;
          padding: 1rem;
          text-align: left;
          cursor: pointer;
          border-radius: 5px;
          margin-bottom: 0.5rem;
          transition: background 0.3s ease;
        }

        .nav-item:hover {
          background: #34495e;
        }

        .nav-item.active {
          background: #3498db;
        }

        .user-info {
          border-top: 1px solid #34495e;
          padding-top: 1rem;
        }

        .logout-button {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          width: 100%;
        }

        .dashboard-main {
          flex: 1;
          padding: 2rem;
        }

        .dashboard-content h2 {
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .welcome-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .welcome-card {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          text-align: center;
        }

        .welcome-card h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .action-button {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 1rem;
        }

        .search-section {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }

        .search-bar {
          display: flex;
          gap: 1rem;
        }

        .search-input {
          flex: 1;
          padding: 0.75rem;
          border: 2px solid #ecf0f1;
          border-radius: 5px;
          font-size: 1rem;
        }

        .search-button {
          background: #27ae60;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 5px;
          cursor: pointer;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: #7f8c8d;
        }

        .no-patients {
          text-align: center;
          padding: 2rem;
          color: #7f8c8d;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .patients-list {
          display: grid;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .patient-card {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .patient-info h4 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
        }

        .patient-info p {
          margin: 0.25rem 0;
          color: #7f8c8d;
        }

        .view-records-button {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
        }

        .patient-records {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-top: 2rem;
        }

        .records-list {
          display: grid;
          gap: 1rem;
          margin-top: 1rem;
        }

        .record-card {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 10px;
          border-left: 4px solid #3498db;
        }

        .record-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .record-header h4 {
          margin: 0;
          color: #2c3e50;
        }

        .record-date {
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        .record-content {
          background: white;
          padding: 1rem;
          border-radius: 5px;
          border: 1px solid #ecf0f1;
        }

        .record-content pre {
          margin: 0;
          white-space: pre-wrap;
          font-family: monospace;
          font-size: 0.9rem;
          color: #2c3e50;
        }

        .error-message {
          background: #e74c3c;
          color: white;
          padding: 1rem;
          border-radius: 5px;
          margin-bottom: 1rem;
        }
      `}</style>
      </div>
    </ApprovalMessage>
  );
};

export default DoctorDashboard;
