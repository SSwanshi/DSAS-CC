// src/pages/DoctorDashboard.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/apiService';
import ApprovalMessage from '../components/common/ApprovalMessage';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
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

  // Handle navigation state from home page
  useEffect(() => {
    if (location.state) {
      if (location.state.activeTab) {
        setActiveTab(location.state.activeTab);
      }
      if (location.state.selectedPatientId) {
        // Automatically fetch records for the selected patient
        fetchPatientRecords(location.state.selectedPatientId);
      }
    }
  }, [location.state]);

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
      setError(''); // Clear any previous errors
      const response = await apiService.getPatientRecordsForDoctor(patientId);
      setPatientRecords(response.data.records);
      setSelectedPatient(patientId);
    } catch (error) {
      console.error('Error fetching patient records:', error);
      
      // Check if it's a 403 Forbidden error (not assigned to patient)
      if (error.response?.status === 403) {
        setError('You are not assigned to this patient, therefore cannot see his/her data');
      } else if (error.response?.status === 404) {
        setError('Patient not found or no records available');
      } else {
        setError('Failed to fetch patient records. Please try again.');
      }
      
      setPatientRecords([]);
      setSelectedPatient(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to format decrypted data in a user-friendly way
  const formatRecordData = (data) => {
    if (!data) return 'No data available';
    
    // If it's already a string, try to parse it
    let parsedData;
    try {
      parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      return data; // Return as-is if not valid JSON
    }

    // Format the data nicely
    const formatField = (key, value) => {
      if (!value || value === '') return null;
      
      // Convert camelCase/snake_case to readable format
      const readableKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^./, str => str.toUpperCase())
        .trim();
      
      return { key: readableKey, value };
    };

    const formattedFields = [];
    
    // Common health record fields
    const commonFields = [
      'patientName', 'patient_name', 'name',
      'age',
      'gender',
      'symptoms',
      'diagnosis',
      'medications',
      'notes', 'additionalNotes', 'additional_notes',
      'dataType', 'data_type',
      'bloodPressure', 'blood_pressure',
      'heartRate', 'heart_rate',
      'temperature',
      'weight',
      'height',
      'allergies',
      'medicalHistory', 'medical_history'
    ];

    // Add common fields first
    commonFields.forEach(field => {
      if (parsedData[field]) {
        const formatted = formatField(field, parsedData[field]);
        if (formatted) formattedFields.push(formatted);
      }
    });

    // Add any remaining fields
    Object.keys(parsedData).forEach(key => {
      if (!commonFields.includes(key) && parsedData[key]) {
        const formatted = formatField(key, parsedData[key]);
        if (formatted) formattedFields.push(formatted);
      }
    });

    return formattedFields;
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
                    <h4>{(record.dataType || record.data_type || 'Unknown').replace('_', ' ').toUpperCase()}</h4>
                    <span className="record-date">
                      {new Date(record.createdAt || record.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="record-content">
                    {(() => {
                      const formattedData = formatRecordData(record.decryptedData);
                      return Array.isArray(formattedData) ? (
                        <div className="formatted-data">
                          {formattedData.map((field, index) => (
                            <div key={index} className="data-field">
                              <span className="field-label">{field.key}:</span>
                              <span className="field-value">{field.value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="raw-data">
                          <pre>{formattedData}</pre>
                        </div>
                      );
                    })()}
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
                    <h4>{(record.dataType || record.data_type || 'Unknown').replace('_', ' ').toUpperCase()}</h4>
                    <span className="record-date">
                      {new Date(record.createdAt || record.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="record-content">
                    {(() => {
                      const formattedData = formatRecordData(record.decryptedData);
                      return Array.isArray(formattedData) ? (
                        <div className="formatted-data">
                          {formattedData.map((field, index) => (
                            <div key={index} className="data-field">
                              <span className="field-label">{field.key}:</span>
                              <span className="field-value">{field.value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="raw-data">
                          <pre>{formattedData}</pre>
                        </div>
                      );
                    })()}
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
          {error && (
            <div className={`error-message ${error.includes('not assigned') ? 'error-warning' : 'error-danger'}`}>
              <div className="error-icon">
                {error.includes('not assigned') ? '⚠️' : '❌'}
              </div>
              <div className="error-content">
                <strong>{error.includes('not assigned') ? 'Access Restricted' : 'Error'}</strong>
                <p>{error}</p>
              </div>
            </div>
          )}
          {activeTab === 'home' && renderHome()}
          {activeTab === 'assigned-patients' && renderAssignedPatients()}
          {activeTab === 'search-patients' && renderSearchPatients()}
        </div>

        <style jsx>{`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .doctor-dashboard {
    display: flex;
    min-height: 100vh;
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
  }

  .dashboard-sidebar {
    width: 280px;
    background: linear-gradient(180deg, #0984e3 0%, #0652DD 100%);
    color: white;
    padding: 2rem 0;
    display: flex;
    flex-direction: column;
    box-shadow: 4px 0 20px rgba(9, 132, 227, 0.3);
    position: sticky;
    top: 0;
    height: 100vh;
  }

  .logo {
    padding: 0 1.5rem 2rem;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    margin-bottom: 2rem;
  }

  .logo h2 {
    margin: 0;
    font-size: 2.5rem;
    color: white;
    font-weight: 800;
    letter-spacing: 2px;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  }

  .dashboard-nav {
    flex: 1;
    padding: 0 1rem;
    overflow-y: auto;
  }

  .nav-item {
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: rgba(255, 255, 255, 0.9);
    padding: 1rem 1.25rem;
    text-align: left;
    cursor: pointer;
    border-radius: 12px;
    margin-bottom: 0.75rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 0.95rem;
    font-weight: 500;
    backdrop-filter: blur(10px);
  }

  .nav-item:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .nav-item.active {
    background: white;
    color: #0984e3;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .user-info {
    padding: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  .user-info p {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 1rem;
    font-size: 0.95rem;
    font-weight: 500;
    text-align: center;
  }

  .logout-button {
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    cursor: pointer;
    width: 100%;
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
  }

  .logout-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.5);
  }

  .dashboard-main {
    flex: 1;
    padding: 2.5rem;
    overflow-y: auto;
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .dashboard-content h2 {
    color: #1e3a8a;
    margin-bottom: 1.5rem;
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: -0.5px;
    text-align: center;
    animation: slideDown 0.5s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .welcome-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .welcome-card {
    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
    color: white;
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(14, 165, 233, 0.3);
    text-align: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeInUp 0.5s ease-out;
    animation-fill-mode: both;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .welcome-card:nth-child(1) { animation-delay: 0.1s; }
  .welcome-card:nth-child(2) { animation-delay: 0.2s; }

  .welcome-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 45px rgba(14, 165, 233, 0.4);
  }

  .welcome-card h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .welcome-card p {
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
    line-height: 1.6;
    opacity: 0.95;
  }

  .action-button {
    background: white;
    color: #0284c7;
    border: none;
    padding: 0.9rem 2rem;
    border-radius: 12px;
    cursor: pointer;
    margin-top: 1rem;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .action-button:hover {
    background: #f0f9ff;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  .search-section {
    background: white;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    margin-bottom: 2rem;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .search-bar {
    display: flex;
    gap: 1rem;
  }

  .search-input {
    flex: 1;
    padding: 1rem 1.25rem;
    border: 2px solid #bfdbfe;
    border-radius: 12px;
    font-size: 1rem;
    color: #1e3a8a;
    background: #f0f9ff;
    transition: all 0.3s ease;
  }

  .search-input:focus {
    border-color: #0284c7;
    background: white;
    outline: none;
    box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.1);
  }

  .search-button {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  .search-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }

  .loading {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    color: #64748b;
    font-size: 1.1rem;
    font-weight: 500;
  }

  .no-patients {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    color: #64748b;
    font-size: 1rem;
  }

  .patients-list {
    display: grid;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .patient-card {
    background: white;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);
    gap: 2rem;
  }

  .patient-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  }

  .patient-info {
    flex: 1;
  }

  .patient-info h4 {
    margin: 0 0 1rem 0;
    color: #1e3a8a;
    font-size: 1.3rem;
    font-weight: 600;
  }

  .patient-info p {
    margin: 0.5rem 0;
    color: #64748b;
    font-size: 0.95rem;
  }

  .view-records-button {
    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
    flex-shrink: 0;
  }

  .view-records-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(14, 165, 233, 0.5);
  }

  .patient-records {
    background: white;
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    margin-top: 2rem;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .patient-records h3 {
    color: #1e3a8a;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  .records-list {
    display: grid;
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .record-card {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    padding: 2rem;
    border-radius: 16px;
    border-left: 5px solid #0284c7;
    transition: all 0.3s ease;
  }

  .record-card:hover {
    transform: translateX(5px);
    box-shadow: 0 8px 25px rgba(2, 132, 199, 0.15);
  }

  .record-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #bfdbfe;
  }

  .record-header h4 {
    margin: 0;
    color: #1e3a8a;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .record-date {
    color: #64748b;
    font-size: 0.95rem;
    font-weight: 500;
  }

  .record-content {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid #bfdbfe;
    box-shadow: 0 2px 8px rgba(2, 132, 199, 0.08);
  }

  .record-content pre {
    margin: 0;
    white-space: pre-wrap;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    color: #1e3a8a;
    line-height: 1.6;
  }

  .error-message {
    display: flex;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    font-weight: 500;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    animation: slideDown 0.3s ease-out;
  }

  .error-danger {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
  }

  .error-warning {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
  }

  .error-icon {
    font-size: 1.5rem;
    margin-right: 1rem;
    flex-shrink: 0;
  }

  .error-content {
    flex: 1;
  }

  .error-content strong {
    display: block;
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }

  .error-content p {
    margin: 0;
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    .doctor-dashboard {
      flex-direction: column;
    }

    .dashboard-sidebar {
      width: 100%;
      height: auto;
      position: relative;
    }

    .dashboard-main {
      padding: 1.5rem;
    }

    .patient-card {
      flex-direction: column;
      text-align: center;
    }

    .search-bar {
      flex-direction: column;
    }

    .welcome-cards {
      grid-template-columns: 1fr;
    }
  }
`}</style>
      </div>
    </ApprovalMessage>
  );
};

export default DoctorDashboard;
