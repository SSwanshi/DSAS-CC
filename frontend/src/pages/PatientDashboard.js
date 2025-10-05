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
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .patient-dashboard {
    display: flex;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
  }

  .dashboard-sidebar {
    width: 280px;
    background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
    color: white;
    padding: 2rem 0;
    display: flex;
    flex-direction: column;
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    height: 100vh;
  }

  .logo {
    padding: 0 1.5rem 2rem;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 2rem;
  }

  .logo h2 {
    margin: 0;
    font-size: 2.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 800;
    letter-spacing: 2px;
  }

  .dashboard-nav {
    flex: 1;
    padding: 0 1rem;
    overflow-y: auto;
  }

  .nav-item {
    width: 100%;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    padding: 1rem 1.25rem;
    text-align: left;
    cursor: pointer;
    border-radius: 12px;
    margin-bottom: 0.5rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 0.95rem;
    font-weight: 500;
  }

  .nav-item:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: translateX(5px);
  }

  .nav-item.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }

  .user-info {
    padding: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .user-info p {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 1rem;
    font-size: 0.95rem;
    font-weight: 500;
  }

  .logout-button {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    cursor: pointer;
    width: 100%;
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  }

  .logout-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.5);
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
    color: #1e293b;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
    letter-spacing: -0.5px;
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

  .dashboard-content > p {
    color: #64748b;
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .welcome-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .welcome-card {
    background: white;
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    text-align: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(0, 0, 0, 0.05);
    animation: fadeInUp 0.5s ease-out;
    animation-fill-mode: both;
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
    box-shadow: 0 15px 45px rgba(0, 0, 0, 0.15);
  }

  .welcome-card h3 {
    color: #1e293b;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .welcome-card p {
    color: #64748b;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .action-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 0.9rem 2rem;
    border-radius: 12px;
    cursor: pointer;
    margin-top: 1rem;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }

  .action-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
  }

  .upload-form {
    background: white;
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    max-width: 900px;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.75rem;
    color: #1e293b;
    font-weight: 600;
    font-size: 1rem;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 1rem 1.25rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    color: #1e293b;
    background: #f8fafc;
    transition: all 0.3s ease;
    font-family: inherit;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }

  .form-group textarea {
    resize: vertical;
    min-height: 100px;
  }

  .submit-button {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    padding: 1.1rem 2.5rem;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  }

  .submit-button:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.5);
  }

  .submit-button:disabled {
    background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
    cursor: not-allowed;
    box-shadow: none;
  }

  .error-message {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    padding: 1.25rem 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    font-weight: 500;
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
    animation: slideDown 0.3s ease-out;
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

  .no-records {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    color: #64748b;
    font-size: 1rem;
  }

  .records-list {
    display: grid;
    gap: 1.5rem;
  }

  .record-card {
    background: white;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .record-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  }

  .record-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e8ecf1;
  }

  .record-header h4 {
    margin: 0;
    color: #1e293b;
    font-size: 1.3rem;
    font-weight: 600;
  }

  .record-date {
    color: #64748b;
    font-size: 0.95rem;
    font-weight: 500;
  }

  .record-details p {
    margin: 0.75rem 0;
    color: #475569;
    font-size: 0.95rem;
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 10px;
    transition: all 0.3s ease;
  }

  .record-details p:hover {
    background: #e8ecf1;
    transform: translateX(5px);
  }

  .record-details strong {
    color: #1e293b;
    font-weight: 600;
  }

  .encrypted-status {
    color: #10b981;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .patient-dashboard {
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

    .welcome-cards {
      grid-template-columns: 1fr;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .upload-form {
      padding: 1.5rem;
    }
  }
`}</style>
      </div>
    </ApprovalMessage>
  );
};

export default PatientDashboard;
