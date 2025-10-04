// src/pages/PatientDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/apiService';
import ApprovalMessage from '../components/common/ApprovalMessage';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    dataType: '',
    patientName: '',
    age: '',
    gender: '',
    symptoms: '',
    diagnosis: '',
    medications: '',
    notes: ''
  });

  useEffect(() => {
    if (activeTab === 'records') {
      fetchRecords();
    }
  }, [activeTab]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPatientRecords();
      setRecords(response.data.records);
    } catch (error) {
      setError('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiService.uploadRecord({
        formData,
        dataType: formData.dataType,
        fileName: `health_record_${Date.now()}`,
        fileSize: JSON.stringify(formData).length
      });
      
      setFormData({
        dataType: '',
        patientName: '',
        age: '',
        gender: '',
        symptoms: '',
        diagnosis: '',
        medications: '',
        notes: ''
      });
      
      alert('Record uploaded successfully!');
    } catch (error) {
      setError('Failed to upload record');
    } finally {
      setLoading(false);
    }
  };

  const renderHome = () => (
    <div className="dashboard-content">
      <h2>Welcome, {user?.firstName} {user?.lastName}</h2>
      <div className="welcome-cards">
        <div className="welcome-card">
          <h3>📊 Your Health Records</h3>
          <p>View and manage your encrypted health data</p>
          <button onClick={() => setActiveTab('records')} className="action-button">
            View Records
          </button>
        </div>
        <div className="welcome-card">
          <h3>📤 Upload New Data</h3>
          <p>Securely upload your health information</p>
          <button onClick={() => setActiveTab('upload')} className="action-button">
            Upload Data
          </button>
        </div>
      </div>
    </div>
  );

  const renderUpload = () => (
    <div className="dashboard-content">
      <h2>Upload Health Data</h2>
      <p>Fill out the form below to securely upload your health information. All data will be encrypted before storage.</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleUpload} className="upload-form">
        <div className="form-row">
          <div className="form-group">
            <label>Data Type</label>
            <select name="dataType" value={formData.dataType} onChange={handleFormChange} required>
              <option value="">Select Type</option>
              <option value="medical_report">Medical Report</option>
              <option value="lab_results">Lab Results</option>
              <option value="prescription">Prescription</option>
              <option value="general_health">General Health</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Patient Name</label>
            <input 
              type="text" 
              name="patientName" 
              value={formData.patientName} 
              onChange={handleFormChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input 
              type="number" 
              name="age" 
              value={formData.age} 
              onChange={handleFormChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleFormChange} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Symptoms</label>
          <textarea 
            name="symptoms" 
            value={formData.symptoms} 
            onChange={handleFormChange} 
            rows="3"
            placeholder="Describe your symptoms..."
          />
        </div>

        <div className="form-group">
          <label>Diagnosis</label>
          <textarea 
            name="diagnosis" 
            value={formData.diagnosis} 
            onChange={handleFormChange} 
            rows="3"
            placeholder="Medical diagnosis or findings..."
          />
        </div>

        <div className="form-group">
          <label>Medications</label>
          <textarea 
            name="medications" 
            value={formData.medications} 
            onChange={handleFormChange} 
            rows="2"
            placeholder="List current medications..."
          />
        </div>

        <div className="form-group">
          <label>Additional Notes</label>
          <textarea 
            name="notes" 
            value={formData.notes} 
            onChange={handleFormChange} 
            rows="3"
            placeholder="Any additional information..."
          />
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Uploading...' : 'Upload Encrypted Data'}
        </button>
      </form>
    </div>
  );

  const renderRecords = () => (
    <div className="dashboard-content">
      <h2>Your Uploaded Records</h2>
      <p>All your health data is stored in encrypted format for maximum security.</p>
      
      {loading ? (
        <div className="loading">Loading records...</div>
      ) : records.length === 0 ? (
        <div className="no-records">No records found. Upload some health data to get started.</div>
      ) : (
        <div className="records-list">
          {records.map(record => (
            <div key={record.id} className="record-card">
              <div className="record-header">
                <h4>{record.data_type.replace('_', ' ').toUpperCase()}</h4>
                <span className="record-date">
                  {new Date(record.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="record-details">
                <p><strong>File:</strong> {record.file_name}</p>
                <p><strong>Size:</strong> {record.file_size} bytes</p>
                <p><strong>Status:</strong> <span className="encrypted-status">🔒 Encrypted</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <ApprovalMessage user={user}>
      <div className="patient-dashboard">
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
            className={activeTab === 'upload' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('upload')}
          >
            📤 Upload Data
          </button>
          <button 
            className={activeTab === 'records' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('records')}
          >
            📋 See Uploaded Files
          </button>
        </nav>
        <div className="user-info">
          <p>Welcome, {user?.firstName}</p>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-main">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'upload' && renderUpload()}
        {activeTab === 'records' && renderRecords()}
      </div>

      <style jsx>{`
        .patient-dashboard {
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

        .upload-form {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          max-width: 800px;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #2c3e50;
          font-weight: bold;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #ecf0f1;
          border-radius: 5px;
          font-size: 1rem;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3498db;
        }

        .submit-button {
          background: #27ae60;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
        }

        .submit-button:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }

        .error-message {
          background: #e74c3c;
          color: white;
          padding: 1rem;
          border-radius: 5px;
          margin-bottom: 1rem;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: #7f8c8d;
        }

        .no-records {
          text-align: center;
          padding: 2rem;
          color: #7f8c8d;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .records-list {
          display: grid;
          gap: 1rem;
        }

        .record-card {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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

        .record-details p {
          margin: 0.5rem 0;
          color: #34495e;
        }

        .encrypted-status {
          color: #27ae60;
          font-weight: bold;
        }
      `}</style>
      </div>
    </ApprovalMessage>
  );
};

export default PatientDashboard;
