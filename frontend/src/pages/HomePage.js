// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';

const HomePage = () => {
  const [message, setMessage] = useState('Connecting to server...');
  const navigate = useNavigate();

  useEffect(() => {
    apiService.testBackend()
      .then(response => setMessage(response.data.message))
      .catch(error => setMessage("Failed to connect to backend."));
  }, []);

  const handleRoleClick = (role) => {
    if (role === 'admin') {
      navigate('/admin-login');
    } else if (role === 'doctor') {
      navigate('/doctor-login');
    } else if (role === 'patient') {
      navigate('/patient-login');
    }
  };

  return (
    <div className="homepage">
      <div className="hero-section">
        <h1>Welcome to DSAS</h1>
        <p className="subtitle">Doctor-Patient-Admin Secure Data Sharing System</p>
        <p className="description">
          Your health data, securely managed and accessible anytime, anywhere.
        </p>
        <p className="server-status">
          <strong>Server Status:</strong> {message}
        </p>
      </div>

      <div className="role-selection">
        <h2>Choose Your Role</h2>
        <div className="role-cards">
          <div className="role-card" onClick={() => handleRoleClick('doctor')}>
            <div className="role-icon">👨‍⚕️</div>
            <h3>Doctor</h3>
            <p>Access patient records and manage healthcare data</p>
            <button className="role-button">Login / Register</button>
          </div>

          <div className="role-card" onClick={() => handleRoleClick('patient')}>
            <div className="role-icon">👤</div>
            <h3>Patient</h3>
            <p>Upload and manage your health records securely</p>
            <button className="role-button">Login / Register</button>
          </div>

          <div className="role-card" onClick={() => handleRoleClick('admin')}>
            <div className="role-icon">☁️</div>
            <h3>Cloud Server</h3>
            <p>Manage users, approvals, and system administration</p>
            <button className="role-button">Admin Login</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .homepage {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem 0;
        }

        .hero-section h1 {
          font-size: 3rem;
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .subtitle {
          font-size: 1.5rem;
          color: #7f8c8d;
          margin-bottom: 1rem;
        }

        .description {
          font-size: 1.1rem;
          color: #34495e;
          margin-bottom: 1rem;
        }

        .server-status {
          font-size: 0.9rem;
          color: #27ae60;
          background: #d5f4e6;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          display: inline-block;
        }

        .role-selection h2 {
          text-align: center;
          margin-bottom: 2rem;
          color: #2c3e50;
        }

        .role-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .role-card {
          background: white;
          border: 2px solid #ecf0f1;
          border-radius: 10px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .role-card:hover {
          border-color: #3498db;
          transform: translateY(-5px);
          box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        }

        .role-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .role-card h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .role-card p {
          color: #7f8c8d;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .role-button {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .role-button:hover {
          background: #2980b9;
        }
      `}</style>
    </div>
  );
};

export default HomePage;