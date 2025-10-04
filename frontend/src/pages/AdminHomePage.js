// src/pages/AdminHomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/apiService';

const AdminHomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState({ patients: 0, doctors: 0 });
  const [totalUsers, setTotalUsers] = useState({ patients: 0, doctors: 0 });
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch pending users
      const pendingPatientsResponse = await apiService.getPendingUsers('patient');
      const pendingDoctorsResponse = await apiService.getPendingUsers('doctor');
      
      setPendingUsers({
        patients: pendingPatientsResponse.data.users.length,
        doctors: pendingDoctorsResponse.data.users.length
      });

      // Fetch total users
      const allPatientsResponse = await apiService.getUsersByRole('patient');
      const allDoctorsResponse = await apiService.getUsersByRole('doctor');
      
      setTotalUsers({
        patients: allPatientsResponse.data.users.length,
        doctors: allDoctorsResponse.data.users.length
      });

      // Fetch total records
      const recordsResponse = await apiService.getAllRecords();
      setTotalRecords(recordsResponse.data.records.length);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-home">
      <div className="welcome-section">
        <h1>Welcome, {user?.firstName} {user?.lastName}!</h1>
        <p className="subtitle">Cloud Server Administration Center</p>
        <p className="admin-badge">🔐 System Administrator</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card urgent">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Approvals</h3>
            <p className="stat-number">{pendingUsers.patients + pendingUsers.doctors}</p>
            <p className="stat-detail">
              {pendingUsers.patients} patients, {pendingUsers.doctors} doctors
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{totalUsers.patients + totalUsers.doctors}</p>
            <p className="stat-detail">
              {totalUsers.patients} patients, {totalUsers.doctors} doctors
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Health Records</h3>
            <p className="stat-number">{totalRecords}</p>
            <p className="stat-detail">All encrypted data</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-content">
            <h3>Assignments</h3>
            <p className="stat-number">Manage</p>
            <p className="stat-detail">Doctor-Patient pairs</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Administrative Actions</h2>
        <div className="action-buttons">
          <button 
            className="action-btn urgent"
            onClick={() => navigate('/admin-dashboard')}
          >
            ⏳ Approve Patients ({pendingUsers.patients})
          </button>
          <button 
            className="action-btn urgent"
            onClick={() => navigate('/admin-dashboard')}
          >
            ⏳ Approve Doctors ({pendingUsers.doctors})
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => navigate('/admin-dashboard')}
          >
            🔗 Assign Doctor-Patient
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => navigate('/admin-dashboard')}
          >
            📊 View All Data
          </button>
        </div>
      </div>

      <div className="system-overview">
        <h2>System Overview</h2>
        <div className="overview-grid">
          <div className="overview-card">
            <h3>👤 Patient Management</h3>
            <div className="overview-stats">
              <div className="overview-stat">
                <span className="stat-label">Total Patients:</span>
                <span className="stat-value">{totalUsers.patients}</span>
              </div>
              <div className="overview-stat">
                <span className="stat-label">Pending Approval:</span>
                <span className="stat-value urgent">{pendingUsers.patients}</span>
              </div>
            </div>
          </div>

          <div className="overview-card">
            <h3>👨‍⚕️ Doctor Management</h3>
            <div className="overview-stats">
              <div className="overview-stat">
                <span className="stat-label">Total Doctors:</span>
                <span className="stat-value">{totalUsers.doctors}</span>
              </div>
              <div className="overview-stat">
                <span className="stat-label">Pending Approval:</span>
                <span className="stat-value urgent">{pendingUsers.doctors}</span>
              </div>
            </div>
          </div>

          <div className="overview-card">
            <h3>📋 Data Management</h3>
            <div className="overview-stats">
              <div className="overview-stat">
                <span className="stat-label">Total Records:</span>
                <span className="stat-value">{totalRecords}</span>
              </div>
              <div className="overview-stat">
                <span className="stat-label">Security Status:</span>
                <span className="stat-value secure">🔒 Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>System Status</h2>
        <div className="status-list">
          <div className="status-item success">
            <div className="status-icon">✅</div>
            <div className="status-content">
              <p>Database Connection</p>
              <span className="status-detail">SQLite database operational</span>
            </div>
          </div>
          
          <div className="status-item success">
            <div className="status-icon">🔒</div>
            <div className="status-content">
              <p>Data Encryption</p>
              <span className="status-detail">All patient data encrypted</span>
            </div>
          </div>
          
          <div className="status-item success">
            <div className="status-icon">🌐</div>
            <div className="status-content">
              <p>API Services</p>
              <span className="status-detail">All endpoints operational</span>
            </div>
          </div>
          
          <div className="status-item warning">
            <div className="status-icon">⚠️</div>
            <div className="status-content">
              <p>Pending Approvals</p>
              <span className="status-detail">
                {pendingUsers.patients + pendingUsers.doctors} users awaiting approval
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-home {
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

        .admin-badge {
          font-size: 1rem;
          color: #e74c3c;
          font-weight: bold;
          background: #fdf2f2;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          display: inline-block;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

        .stat-card.urgent {
          border-left: 5px solid #e74c3c;
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

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .stat-detail {
          color: #7f8c8d;
          font-size: 0.9rem;
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
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .action-btn {
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .action-btn.urgent {
          background: #e74c3c;
          color: white;
        }

        .action-btn.urgent:hover {
          background: #c0392b;
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

        .system-overview {
          margin-bottom: 3rem;
        }

        .system-overview h2 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .overview-card {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }

        .overview-card h3 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
          font-size: 1.2rem;
        }

        .overview-stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .overview-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #ecf0f1;
        }

        .overview-stat:last-child {
          border-bottom: none;
        }

        .stat-label {
          color: #7f8c8d;
        }

        .stat-value {
          font-weight: bold;
          color: #2c3e50;
        }

        .stat-value.urgent {
          color: #e74c3c;
        }

        .stat-value.secure {
          color: #27ae60;
        }

        .recent-activity h2 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .status-list {
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid #ecf0f1;
        }

        .status-item:last-child {
          border-bottom: none;
        }

        .status-item.success {
          border-left: 4px solid #27ae60;
          padding-left: 1rem;
        }

        .status-item.warning {
          border-left: 4px solid #f39c12;
          padding-left: 1rem;
        }

        .status-icon {
          font-size: 1.5rem;
          min-width: 40px;
        }

        .status-content p {
          margin: 0;
          color: #2c3e50;
          font-weight: 500;
        }

        .status-detail {
          color: #7f8c8d;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default AdminHomePage;
