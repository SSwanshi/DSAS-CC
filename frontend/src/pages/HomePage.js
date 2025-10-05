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
      .catch(() => setMessage("Failed to connect to backend."));
  }, []);

  const handleRoleClick = (role) => {
    if (role === 'admin') navigate('/admin-login');
    else if (role === 'doctor') navigate('/doctor-login');
    else if (role === 'patient') navigate('/patient-login');
  };

  return (
    <div className="homepage">
      <div className="hero-section">
        <h1>Welcome to <span className="highlight">DSAS</span></h1>
        <p className="subtitle">Doctor-Patient-Admin Secure Data Sharing System</p>
        <p className="description">
          Empowering secure access and management of healthcare data — anytime, anywhere.
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
          min-height: 100vh;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, #e8f0ff, #ffffff);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-family: 'Poppins', sans-serif;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem;
          animation: fadeIn 1s ease-in-out;
        }

        .hero-section h1 {
          font-size: 3rem;
          color: #1a202c;
          margin-bottom: 0.75rem;
          letter-spacing: 1px;
        }

        .highlight {
          color: #0078ff;
        }

        .subtitle {
          font-size: 1.4rem;
          color: #4a5568;
          margin-bottom: 1rem;
        }

        .description {
          font-size: 1.1rem;
          color: #2d3748;
          max-width: 700px;
          margin: 0 auto 1.5rem;
          line-height: 1.6;
        }

        .server-status {
          font-size: 0.95rem;
          color: #155724;
          background: #d4edda;
          border: 1px solid #c3e6cb;
          padding: 0.6rem 1rem;
          border-radius: 6px;
          display: inline-block;
          font-weight: 500;
        }

        .role-selection h2 {
          text-align: center;
          color: #1a202c;
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 2rem;
        }

        .role-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          width: 100%;
          max-width: 1000px;
          animation: fadeUp 1.2s ease-in-out;
        }

        .role-card {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          position: relative;
          overflow: hidden;
        }

        .role-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(0,120,255,0.1), rgba(0,200,180,0.05));
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 15px;
        }

        .role-card:hover::before {
          opacity: 1;
        }

        .role-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 25px rgba(0,0,0,0.1);
        }

        .role-icon {
          font-size: 3.2rem;
          margin-bottom: 1rem;
        }

        .role-card h3 {
          color: #1a202c;
          margin-bottom: 0.8rem;
          font-size: 1.6rem;
          font-weight: 600;
        }

        .role-card p {
          color: #4a5568;
          margin-bottom: 1.5rem;
          font-size: 1rem;
          line-height: 1.5;
        }

        .role-button {
          background: #0078ff;
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(0,120,255,0.3);
        }

        .role-button:hover {
          background: #005fcc;
          box-shadow: 0 6px 14px rgba(0,120,255,0.4);
          transform: translateY(-2px);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .hero-section h1 {
            font-size: 2.3rem;
          }
          .role-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
