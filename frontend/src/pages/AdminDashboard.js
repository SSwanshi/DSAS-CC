// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/apiService';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [unassignedPatients, setUnassignedPatients] = useState([]);
  const [unassignedDoctors, setUnassignedDoctors] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assignmentData, setAssignmentData] = useState({
    doctorId: '',
    patientId: ''
  });

  useEffect(() => {
    if (activeTab === 'approve-patients') {
      fetchPendingUsers('patient');
    } else if (activeTab === 'approve-doctors') {
      fetchPendingUsers('doctor');
    } else if (activeTab === 'assign-doctor') {
      fetchAssignmentData();
    } else if (activeTab === 'view-data') {
      fetchAllRecords();
    }
  }, [activeTab]);

  const fetchPendingUsers = async (role) => {
    try {
      setLoading(true);
      const response = await apiService.getPendingUsers(role);
      setPendingUsers(response.data.users);
    } catch (error) {
      setError('Failed to fetch pending users');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignmentData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAssignmentData();
      setUnassignedPatients(response.data.unassignedPatients);
      setUnassignedDoctors(response.data.unassignedDoctors);
    } catch (error) {
      setError('Failed to fetch assignment data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRecords = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllRecords();
      setAllRecords(response.data.records);
    } catch (error) {
      setError('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId, isApproved) => {
    try {
      await apiService.verifyUser(userId, isApproved);
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      alert(`User ${isApproved ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      setError('Failed to update user status');
    }
  };

  const handleAssignDoctor = async (e) => {
    e.preventDefault();
    if (!assignmentData.doctorId || !assignmentData.patientId) {
      setError('Please select both doctor and patient');
      return;
    }

    try {
      await apiService.assignDoctor(assignmentData);
      alert('Doctor assigned successfully');
      setAssignmentData({ doctorId: '', patientId: '' });
      fetchAssignmentData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to assign doctor');
    }
  };

  const renderHome = () => (
    <div className="dashboard-content">
      <h2>Welcome, {user?.firstName} {user?.lastName}</h2>
      <p>Cloud Server Administration Panel</p>
      <div className="welcome-cards">
        <div className="welcome-card">
          <h3>👥 Approve Patients</h3>
          <p>Review and approve patient registrations</p>
          <button onClick={() => setActiveTab('approve-patients')} className="action-button">
            Manage Patients
          </button>
        </div>
        <div className="welcome-card">
          <h3>👨‍⚕️ Approve Doctors</h3>
          <p>Review and approve doctor registrations</p>
          <button onClick={() => setActiveTab('approve-doctors')} className="action-button">
            Manage Doctors
          </button>
        </div>
        <div className="welcome-card">
          <h3>🔗 Assign Doctor</h3>
          <p>Assign doctors to patients</p>
          <button onClick={() => setActiveTab('assign-doctor')} className="action-button">
            Manage Assignments
          </button>
        </div>
        <div className="welcome-card">
          <h3>📊 View Data</h3>
          <p>View all uploaded encrypted data</p>
          <button onClick={() => setActiveTab('view-data')} className="action-button">
            View Records
          </button>
        </div>
      </div>
    </div>
  );

  const renderApproveUsers = (role) => (
    <div className="dashboard-content">
      <h2>Approve {role.charAt(0).toUpperCase() + role.slice(1)}s</h2>
      
      {loading ? (
        <div className="loading">Loading pending users...</div>
      ) : pendingUsers.length === 0 ? (
        <div className="no-users">No pending {role}s found.</div>
      ) : (
        <div className="users-list">
          {pendingUsers.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <h4>{user.first_name} {user.last_name}</h4>
                <p>Email: {user.email}</p>
                <p>Username: {user.username}</p>
                <p>Phone: {user.phone || 'Not provided'}</p>
                {user.specialization && <p>Specialization: {user.specialization}</p>}
                <p>Registered: {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
              <div className="user-actions">
                <button 
                  onClick={() => handleApproveUser(user.id, true)}
                  className="approve-button"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleApproveUser(user.id, false)}
                  className="reject-button"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAssignDoctor = () => (
    <div className="dashboard-content">
      <h2>Assign Doctor to Patient</h2>
      
      <form onSubmit={handleAssignDoctor} className="assignment-form">
        <div className="form-group">
          <label>Select Patient</label>
          <select 
            value={assignmentData.patientId} 
            onChange={(e) => setAssignmentData({...assignmentData, patientId: e.target.value})}
            required
          >
            <option value="">Choose a patient</option>
            {unassignedPatients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName} ({patient.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Select Doctor</label>
          <select 
            value={assignmentData.doctorId} 
            onChange={(e) => setAssignmentData({...assignmentData, doctorId: e.target.value})}
            required
          >
            <option value="">Choose a doctor</option>
            {unassignedDoctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.firstName} {doctor.lastName} ({doctor.specialization || 'General'})
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="assign-button">
          Assign Doctor
        </button>
      </form>

      <div className="assignment-info">
        <h3>Available for Assignment:</h3>
        <div className="info-cards">
          <div className="info-card">
            <h4>Unassigned Patients</h4>
            <p>{unassignedPatients.length} patients available</p>
          </div>
          <div className="info-card">
            <h4>Available Doctors</h4>
            <p>{unassignedDoctors.length} doctors available</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderViewData = () => (
    <div className="dashboard-content">
      <h2>All Uploaded Data (Encrypted)</h2>
      <p>All patient data is stored in encrypted format for security.</p>
      
      {loading ? (
        <div className="loading">Loading records...</div>
      ) : allRecords.length === 0 ? (
        <div className="no-records">No records found.</div>
      ) : (
        <div className="records-list">
          {allRecords.map(record => (
            <div key={record.id} className="record-card">
              <div className="record-header">
                <h4>{record.dataType.replace('_', ' ').toUpperCase()}</h4>
                <span className="record-date">
                  {new Date(record.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="record-details">
                <p><strong>Patient:</strong> {record.patient.firstName} {record.patient.lastName}</p>
                <p><strong>Email:</strong> {record.patient.email}</p>
                <p><strong>File:</strong> {record.fileName}</p>
                <p><strong>Size:</strong> {record.fileSize} bytes</p>
                <p><strong>Status:</strong> <span className="encrypted-status">🔒 Encrypted</span></p>
              </div>
              <div className="encrypted-data">
                <h5>Encrypted Data:</h5>
                <pre className="encrypted-content">{record.encryptedData}</pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="admin-dashboard">
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
            className={activeTab === 'approve-patients' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('approve-patients')}
          >
            👥 Approve Patient
          </button>
          <button 
            className={activeTab === 'approve-doctors' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('approve-doctors')}
          >
            👨‍⚕️ Approve Doctors
          </button>
          <button 
            className={activeTab === 'assign-doctor' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('assign-doctor')}
          >
            🔗 Assign Doctor
          </button>
          <button 
            className={activeTab === 'view-data' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('view-data')}
          >
            📊 Uploaded Data
          </button>
        </nav>
        <div className="user-info">
          <p>Admin: {user?.firstName}</p>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-main">
        {error && <div className="error-message">{error}</div>}
        {activeTab === 'home' && renderHome()}
        {activeTab === 'approve-patients' && renderApproveUsers('patient')}
        {activeTab === 'approve-doctors' && renderApproveUsers('doctor')}
        {activeTab === 'assign-doctor' && renderAssignDoctor()}
        {activeTab === 'view-data' && renderViewData()}
      </div>

      <style jsx>{`
        .admin-dashboard {
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
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

        .loading {
          text-align: center;
          padding: 2rem;
          color: #7f8c8d;
        }

        .no-users, .no-records {
          text-align: center;
          padding: 2rem;
          color: #7f8c8d;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .users-list, .records-list {
          display: grid;
          gap: 1rem;
        }

        .user-card, .record-card {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .user-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .user-info h4 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
        }

        .user-info p {
          margin: 0.25rem 0;
          color: #7f8c8d;
        }

        .user-actions {
          display: flex;
          gap: 1rem;
        }

        .approve-button {
          background: #27ae60;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
        }

        .reject-button {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
        }

        .assignment-form {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
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

        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #ecf0f1;
          border-radius: 5px;
          font-size: 1rem;
        }

        .assign-button {
          background: #3498db;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
        }

        .assignment-info {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .info-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .info-card {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 5px;
          text-align: center;
        }

        .info-card h4 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
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

        .encrypted-data {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #ecf0f1;
        }

        .encrypted-data h5 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
        }

        .encrypted-content {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 5px;
          font-family: monospace;
          font-size: 0.8rem;
          color: #2c3e50;
          word-break: break-all;
          max-height: 200px;
          overflow-y: auto;
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
  );
};

export default AdminDashboard;
