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
  min-height: 85vh;
  padding: 2rem;
  background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
  font-family: 'Poppins', 'Inter', sans-serif;
}

.admin-login-card {
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.25);
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 450px;
  min-width: 350px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(12px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.admin-login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 60px rgba(0,0,0,0.3);
}

.admin-login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.admin-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.admin-login-header h2 {
  color: #1f2937;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 700;
}

.admin-login-header p {
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
}

.error-message {
  background: #f87171;
  color: white;
  padding: 0.9rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(248,113,113,0.3);
  transition: all 0.3s ease;
}

.admin-login-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-input {
  width: 100%;
  padding: 1rem 1.2rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #6c5ce7;
  box-shadow: 0 0 12px rgba(108,92,231,0.2);
  background-color: #fff;
}

.submit-button {
  width: 100%;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: white;
  box-shadow: 0 6px 18px rgba(108,92,231,0.35);
}

.submit-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #5b4cd1, #8979e0);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(108,92,231,0.45);
}

.submit-button:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.back-to-home {
  text-align: center;
  margin-bottom: 1rem;
}

.back-button {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.3s ease, transform 0.2s ease;
}

.back-button:hover {
  color: #1f2937;
  transform: translateY(-1px);
}

.admin-credentials {
  background: rgba(243,244,246,0.7);
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #4b5563;
  text-align: center;
  margin-top: 1rem;
}

.admin-credentials p {
  margin: 0.25rem 0;
}

/* Responsive */
@media screen and (max-width: 500px) {
  .admin-login-card {
    padding: 2rem 1.5rem;
    max-width: 90%;
  }

  .admin-login-header h2 {
    font-size: 1.8rem;
  }

  .form-input {
    padding: 0.85rem 1rem;
    font-size: 1rem;
  }

  .submit-button {
    padding: 0.85rem;
    font-size: 1rem;
  }
}

      `}</style>
    </div>
  );
};

export default AdminLoginPage;
