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
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalRecords: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    if (activeTab === 'home') {
      fetchDashboardStats();
    } else if (activeTab === 'approve-patients') {
      fetchPendingUsers('patient');
    } else if (activeTab === 'approve-doctors') {
      fetchPendingUsers('doctor');
    } else if (activeTab === 'assign-doctor') {
      fetchAssignmentData();
    } else if (activeTab === 'view-data') {
      fetchAllRecords();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      console.log('Frontend: Fetching dashboard stats...');
      
      // Fetch all users by role
      const [patientsResponse, doctorsResponse, allRecordsResponse, pendingPatientsResponse, pendingDoctorsResponse] = await Promise.all([
        apiService.getUsersByRole('patient'),
        apiService.getUsersByRole('doctor'),
        apiService.getAllRecords(),
        apiService.getPendingUsers('patient'),
        apiService.getPendingUsers('doctor')
      ]);
      
      console.log('Frontend: API responses:', {
        patients: patientsResponse.data,
        doctors: doctorsResponse.data,
        records: allRecordsResponse.data,
        pendingPatients: pendingPatientsResponse.data,
        pendingDoctors: pendingDoctorsResponse.data
      });
      
      const totalPatients = patientsResponse.data.users.length;
      const totalDoctors = doctorsResponse.data.users.length;
      const totalRecords = allRecordsResponse.data.records.length;
      const pendingApprovals = pendingPatientsResponse.data.users.length + pendingDoctorsResponse.data.users.length;
      
      console.log('Frontend: Calculated stats:', {
        totalPatients,
        totalDoctors,
        totalRecords,
        pendingApprovals
      });
      
      setDashboardStats({
        totalUsers: totalPatients + totalDoctors,
        totalPatients,
        totalDoctors,
        totalRecords,
        pendingApprovals
      });
    } catch (error) {
      console.error('Frontend: Error fetching dashboard stats:', error);
      setError('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

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
      
      {loading ? (
        <div className="loading">Loading dashboard statistics...</div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Users</h3>
              <p className="stat-number">{dashboardStats.totalUsers}</p>
              <p className="stat-label">Registered users</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🏥</div>
            <div className="stat-content">
              <h3>Patients</h3>
              <p className="stat-number">{dashboardStats.totalPatients}</p>
              <p className="stat-label">Approved patients</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👨‍⚕️</div>
            <div className="stat-content">
              <h3>Doctors</h3>
              <p className="stat-number">{dashboardStats.totalDoctors}</p>
              <p className="stat-label">Approved doctors</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>Health Records</h3>
              <p className="stat-number">{dashboardStats.totalRecords}</p>
              <p className="stat-label">Uploaded records</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>Pending Approvals</h3>
              <p className="stat-number">{dashboardStats.pendingApprovals}</p>
              <p className="stat-label">Awaiting approval</p>
            </div>
          </div>
        </div>
      )}
      
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
                <h4>{user.firstName || user.first_name} {user.lastName || user.last_name}</h4>
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
            onChange={(e) => setAssignmentData({ ...assignmentData, patientId: e.target.value })}
            required
          >
            <option value="">Choose a patient</option>
            {unassignedPatients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.firstName || patient.first_name} {patient.lastName || patient.last_name} ({patient.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Select Doctor</label>
          <select
            value={assignmentData.doctorId}
            onChange={(e) => setAssignmentData({ ...assignmentData, doctorId: e.target.value })}
            required
          >
            <option value="">Choose a doctor</option>
            {unassignedDoctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.firstName || doctor.first_name} {doctor.lastName || doctor.last_name} ({doctor.specialization || 'General'})
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
                <h4>{(record.dataType || record.data_type || 'Unknown').replace('_', ' ').toUpperCase()}</h4>
                <span className="record-date">
                  {new Date(record.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="record-details">
                <p><strong>Patient:</strong> {record.patient?.firstName || record.patient?.first_name || 'Unknown'} {record.patient?.lastName || record.patient?.last_name || 'Patient'}</p>
                <p><strong>Email:</strong> {record.patient?.email || 'N/A'}</p>
                <p><strong>File:</strong> {record.fileName || record.file_name || 'N/A'}</p>
                <p><strong>Size:</strong> {record.fileSize || record.file_size || 0} bytes</p>
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
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .admin-dashboard {
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
  }

  .dashboard-content h2 {
    color: #1e293b;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  .dashboard-content > p {
    color: #64748b;
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
  }

  .stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    text-align: center;
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }

  .stat-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .stat-content h3 {
    color: #1e293b;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #667eea;
    margin: 0.5rem 0;
  }

  .stat-label {
    color: #64748b;
    font-size: 0.9rem;
    margin: 0;
  }

  .welcome-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
  }

  .welcome-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 45px rgba(0, 0, 0, 0.15);
  }

  .welcome-card h3 {
    color: #1e293b;
    margin-bottom: 1rem;
    font-size: 1.4rem;
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

  .no-users, .no-records {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    color: #64748b;
  }

  .users-list, .records-list {
    display: grid;
    gap: 1.5rem;
  }

  .user-card {
    background: white;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .user-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  }

  .user-info h4 {
    margin: 0 0 1rem 0;
    color: #1e293b;
    font-size: 1.3rem;
    font-weight: 600;
  }

  .user-info p {
    margin: 0.4rem 0;
    color: #64748b;
    font-size: 0.95rem;
  }

  .user-actions {
    display: flex;
    gap: 1rem;
  }

  .approve-button {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 12px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  .approve-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
  }

  .reject-button {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 12px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  .reject-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
  }

  .assignment-form {
    background: white;
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    margin-bottom: 2rem;
    border: 1px solid rgba(0, 0, 0, 0.05);
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

  .form-group select {
    width: 100%;
    padding: 1rem 1.25rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    color: #1e293b;
    background: #f8fafc;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .form-group select:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }

  .assign-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 1.1rem 2.5rem;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    width: 100%;
  }

  .assign-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
  }

  .assignment-info {
    background: white;
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .assignment-info h3 {
    color: #1e293b;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  .info-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .info-card {
    background: linear-gradient(135deg, #f8fafc 0%, #e8ecf1 100%);
    padding: 2rem;
    border-radius: 16px;
    text-align: center;
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .info-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .info-card h4 {
    margin: 0 0 0.5rem 0;
    color: #1e293b;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .info-card p {
    color: #64748b;
    font-size: 0.95rem;
    margin: 0;
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
    padding: 0.5rem;
    background: #f8fafc;
    border-radius: 8px;
  }

  .record-details strong {
    color: #1e293b;
    font-weight: 600;
  }

  .encrypted-status {
    color: #10b981;
    font-weight: 600;
  }

  .encrypted-data {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 2px solid #e8ecf1;
  }

  .encrypted-data h5 {
    margin: 0 0 1rem 0;
    color: #1e293b;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .encrypted-content {
    background: linear-gradient(135deg, #f8fafc 0%, #e8ecf1 100%);
    padding: 1.5rem;
    border-radius: 12px;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    color: #475569;
    word-break: break-all;
    max-height: 250px;
    overflow-y: auto;
    border: 1px solid #e2e8f0;
  }

  .encrypted-content::-webkit-scrollbar {
    width: 8px;
  }

  .encrypted-content::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }

  .encrypted-content::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }

  .encrypted-content::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
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

  @media (max-width: 768px) {
    .admin-dashboard {
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

    .user-card {
      flex-direction: column;
      text-align: center;
    }

    .user-actions {
      width: 100%;
      flex-direction: column;
    }
  }
`}</style>
    </div>
  );
};

export default AdminDashboard;
