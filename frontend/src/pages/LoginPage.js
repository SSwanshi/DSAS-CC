// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/apiService';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get role from URL parameters or default to patient
  const urlParams = new URLSearchParams(location.search);
  const role = urlParams.get('role') || 'patient';

  useEffect(() => {
    setFormData(prev => ({ ...prev, role }));
  }, [role]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value, role });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const response = await apiService.login(formData);
        login(response.data.user, response.data.token);
        
        // Navigate based on role
        if (response.data.user.role === 'patient') {
          navigate('/patient-home');
        } else if (response.data.user.role === 'doctor') {
          navigate('/doctor-home');
        }
      } else {
        // Ensure role is included in formData for registration
        const registrationData = { ...formData, role };
        
        const response = await apiService.register(registrationData);
        login(response.data.user, response.data.token);
        
        // Navigate based on role
        if (response.data.user.role === 'patient') {
          navigate('/patient-home');
        } else if (response.data.user.role === 'doctor') {
          navigate('/doctor-home');
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          <p className="role-indicator">as {role.charAt(0).toUpperCase() + role.slice(1)}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <input 
                name="username" 
                type="text" 
                placeholder="Username" 
                onChange={handleChange} 
                required 
                className="form-input"
              />
            </div>
          )}
          
          <div className="form-group">
            <input 
              name="email" 
              type="email" 
              placeholder="Email" 
              onChange={handleChange} 
              required 
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <input 
              name="password" 
              type="password" 
              placeholder="Password" 
              onChange={handleChange} 
              required 
              className="form-input"
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <input 
                  name="firstName" 
                  type="text" 
                  placeholder="First Name" 
                  onChange={handleChange} 
                  required 
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <input 
                  name="lastName" 
                  type="text" 
                  placeholder="Last Name" 
                  onChange={handleChange} 
                  required 
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <input 
                  name="phone" 
                  type="tel" 
                  placeholder="Phone Number" 
                  onChange={handleChange} 
                  className="form-input"
                />
              </div>

              {role === 'doctor' && (
                <div className="form-group">
                  <input 
                    name="specialization" 
                    type="text" 
                    placeholder="Specialization" 
                    onChange={handleChange} 
                    className="form-input"
                  />
                </div>
              )}
            </>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div className="switch-form">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              // Ensure role is preserved when switching modes
              setFormData(prev => ({ ...prev, role }));
            }}
            className="switch-button"
          >
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </button>
        </div>

        <div className="back-to-home">
          <button 
            onClick={() => navigate('/')}
            className="back-button"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 2rem;
        }

        .login-card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          padding: 2rem;
          width: 100%;
          max-width: 400px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-header h2 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .role-indicator {
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

        .login-form {
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
          background: #3498db;
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .submit-button:hover:not(:disabled) {
          background: #2980b9;
        }

        .submit-button:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }

        .switch-form {
          text-align: center;
          margin-bottom: 1rem;
        }

        .switch-button {
          background: none;
          border: none;
          color: #3498db;
          cursor: pointer;
          text-decoration: underline;
        }

        .back-to-home {
          text-align: center;
        }

        .back-button {
          background: none;
          border: none;
          color: #7f8c8d;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;