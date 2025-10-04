// src/pages/DoctorLoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/apiService';

const DoctorLoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ role: 'doctor' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value, role: 'doctor' });
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
        
        // Navigate to doctor home
        if (response.data.user.role === 'doctor') {
          if (response.data.user.isApproved) {
            navigate('/doctor-home');
          } else {
            alert('Your account is pending approval. Please wait for admin approval before accessing your account.');
            navigate('/');
          }
        } else {
          setError('Invalid account type. Please use the correct login page.');
        }
      } else {
        // Ensure role is included in formData for registration
        const registrationData = { ...formData, role: 'doctor' };
        
        const response = await apiService.register(registrationData);
        login(response.data.user, response.data.token);
        
        // Check if user is approved
        if (response.data.user.role === 'doctor') {
          if (response.data.user.isApproved) {
            navigate('/doctor-home');
          } else {
            alert('Registration successful! Please wait for approval from admin before accessing your account.');
            navigate('/');
          }
        } else {
          setError('Registration failed. Please try again.');
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
      <div className="login-card doctor-card">
        <div className="login-header">
          <div className="role-icon">👨‍⚕️</div>
          <h2>{isLogin ? 'Doctor Login' : 'Doctor Registration'}</h2>
          <p className="role-indicator">Healthcare Professional Portal</p>
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

              <div className="form-group">
                <input 
                  name="specialization" 
                  type="text" 
                  placeholder="Medical Specialization" 
                  onChange={handleChange} 
                  required
                  className="form-input"
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="submit-button doctor-button"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login as Doctor' : 'Register as Doctor')}
          </button>
        </form>

        <div className="switch-form">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData(prev => ({ ...prev, role: 'doctor' }));
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .login-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          padding: 2.5rem;
          width: 100%;
          max-width: 450px;
          position: relative;
          overflow: hidden;
        }

        .doctor-card {
          border-top: 5px solid #e74c3c;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .role-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .login-header h2 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-size: 1.8rem;
        }

        .role-indicator {
          color: #7f8c8d;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .error-message {
          background: #e74c3c;
          color: white;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
          font-weight: 500;
        }

        .login-form {
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-input {
          width: 100%;
          padding: 0.875rem;
          border: 2px solid #ecf0f1;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #e74c3c;
          box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
        }

        .submit-button {
          width: 100%;
          border: none;
          padding: 0.875rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .doctor-button {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
        }

        .doctor-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #c0392b, #a93226);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
        }

        .submit-button:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
          transform: none;
        }

        .switch-form {
          text-align: center;
          margin-bottom: 1rem;
        }

        .switch-button {
          background: none;
          border: none;
          color: #e74c3c;
          cursor: pointer;
          text-decoration: underline;
          font-weight: 500;
        }

        .switch-button:hover {
          color: #c0392b;
        }

        .back-to-home {
          text-align: center;
        }

        .back-button {
          background: none;
          border: none;
          color: #7f8c8d;
          cursor: pointer;
          font-weight: 500;
        }

        .back-button:hover {
          color: #2c3e50;
        }
      `}</style>
    </div>
  );
};

export default DoctorLoginPage;
