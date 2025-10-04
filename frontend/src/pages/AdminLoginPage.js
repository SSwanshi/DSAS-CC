// src/pages/AdminLoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/apiService';

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.login(formData);
      
      if (response.data.user.role !== 'admin') {
        setError('Access denied. Admin credentials required.');
        return;
      }
      
      login(response.data.user, response.data.token);
      navigate('/admin-home');
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-icon">☁️</div>
          <h2>Cloud Server Login</h2>
          <p>Admin Access Required</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <input 
              name="email" 
              type="email" 
              placeholder="Admin Email" 
              onChange={handleChange} 
              required 
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <input 
              name="password" 
              type="password" 
              placeholder="Admin Password" 
              onChange={handleChange} 
              required 
              className="form-input"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Authenticating...' : 'Login to Cloud Server'}
          </button>
        </form>

        <div className="back-to-home">
          <button 
            onClick={() => navigate('/')}
            className="back-button"
          >
            ← Back to Home
          </button>
        </div>

        <div className="admin-credentials">
          <p><strong>Default Admin Credentials:</strong></p>
          <p>Email: admin@dsas.com</p>
          <p>Password: password</p>
        </div>
      </div>

      <style jsx>{`
        .admin-login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 2rem;
        }

        .admin-login-card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          padding: 2rem;
          width: 100%;
          max-width: 400px;
        }

        .admin-login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .admin-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .admin-login-header h2 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .admin-login-header p {
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        .error-message {
          background: #e74c3c;
          color: white;
          padding: 0.75rem;
          border-radius: 5px;
          margin-bottom: 1rem;
          text-align: center;
        }

        .admin-login-form {
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #ecf0f1;
          border-radius: 5px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #3498db;
        }

        .submit-button {
          width: 100%;
          background: #e74c3c;
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .submit-button:hover:not(:disabled) {
          background: #c0392b;
        }

        .submit-button:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }

        .back-to-home {
          text-align: center;
          margin-bottom: 1rem;
        }

        .back-button {
          background: none;
          border: none;
          color: #7f8c8d;
          cursor: pointer;
        }

        .admin-credentials {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 5px;
          font-size: 0.8rem;
          color: #6c757d;
          text-align: center;
        }

        .admin-credentials p {
          margin: 0.25rem 0;
        }
      `}</style>
    </div>
  );
};

export default AdminLoginPage;
