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
          padding: 2.5rem;
          max-width: 1400px;
          margin: 0 auto;
          background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
        }

        .loading {
          font-size: 1.3rem;
          color: #5a6c7d;
          font-weight: 500;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .welcome-section {
          text-align: center;
          margin-bottom: 3rem;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
          color: white;
          animation: fadeInDown 0.6s ease-out;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .welcome-section h1 {
          font-size: 2.8rem;
          color: white;
          margin-bottom: 0.8rem;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .subtitle {
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 1rem;
          font-weight: 400;
        }

        .admin-badge {
          font-size: 1rem;
          color: #fff;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 0.7rem 1.5rem;
          border-radius: 25px;
          display: inline-block;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
          animation: fadeInUp 0.6s ease-out 0.2s both;
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

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-card.urgent {
          border-left: 5px solid #e74c3c;
          background: linear-gradient(135deg, #fff 0%, #fff5f5 100%);
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.15);
        }

        .stat-icon {
          font-size: 3.5rem;
          min-width: 85px;
          text-align: center;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
          transition: transform 0.3s ease;
        }

        .stat-card:hover .stat-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .stat-content {
          flex: 1;
        }

        .stat-content h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 1.2rem;
          font-weight: 600;
          letter-spacing: -0.3px;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .stat-detail {
          color: #7f8c8d;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .quick-actions {
          margin-bottom: 3rem;
          animation: fadeInUp 0.6s ease-out 0.3s both;
        }

        .quick-actions h2 {
          color: #2c3e50;
          margin-bottom: 2rem;
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .action-btn {
          padding: 1.3rem 2rem;
          border: none;
          border-radius: 15px;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }

        .action-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .action-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .action-btn.urgent {
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          color: white;
        }

        .action-btn.urgent:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(231, 76, 60, 0.4);
        }

        .action-btn.secondary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .action-btn.secondary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .system-overview {
          margin-bottom: 3rem;
          animation: fadeInUp 0.6s ease-out 0.4s both;
        }

        .system-overview h2 {
          color: #2c3e50;
          margin-bottom: 2rem;
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .overview-card {
          background: white;
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .overview-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .overview-card h3 {
          color: #2c3e50;
          margin-bottom: 1.8rem;
          font-size: 1.3rem;
          font-weight: 600;
          padding-bottom: 1rem;
          border-bottom: 3px solid #667eea;
        }

        .overview-stats {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .overview-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .overview-stat:hover {
          background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
          transform: translateX(5px);
        }

        .stat-label {
          color: #5a6c7d;
          font-weight: 500;
          font-size: 1rem;
        }

        .stat-value {
          font-weight: 700;
          color: #2c3e50;
          font-size: 1.1rem;
        }

        .stat-value.urgent {
          color: #e74c3c;
          animation: pulse 2s ease-in-out infinite;
        }

        .stat-value.secure {
          color: #27ae60;
        }

        .recent-activity {
          animation: fadeInUp 0.6s ease-out 0.5s both;
        }

        .recent-activity h2 {
          color: #2c3e50;
          margin-bottom: 2rem;
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .status-list {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .status-item:last-child {
          margin-bottom: 0;
        }

        .status-item:hover {
          background: #e9ecef;
          transform: translateX(5px);
        }

        .status-item.success {
          border-left: 5px solid #27ae60;
        }

        .status-item.warning {
          border-left: 5px solid #f39c12;
        }

        .status-icon {
          font-size: 2rem;
          min-width: 50px;
          text-align: center;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .status-content {
          flex: 1;
        }

        .status-content p {
          margin: 0 0 0.3rem 0;
          color: #2c3e50;
          font-weight: 600;
          font-size: 1.05rem;
        }

        .status-detail {
          color: #7f8c8d;
          font-size: 0.95rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .admin-home {
            padding: 1.5rem;
          }

          .welcome-section h1 {
            font-size: 2rem;
          }

          .stats-grid,
          .action-buttons,
          .overview-grid {
            grid-template-columns: 1fr;
          }

          .stat-number {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminHomePage;