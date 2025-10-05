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
  min-height: 85vh;
  padding: 2rem;
  background: linear-gradient(135deg, #5f72be 0%, #9b23ea 100%);
  font-family: 'Inter', 'Poppins', sans-serif;
}

.login-card {
  background: rgba(255, 255, 255, 0.97);
  border-radius: 25px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  padding: 3rem 3rem;
  width: 100%;
  max-width: 500px;
  min-width: 350px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(12px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 60px rgba(0,0,0,0.3);
}

.doctor-card {
  border-top: 6px solid #e74c3c;
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.role-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.login-header h2 {
  color: #546e92ff;
  margin-bottom: 0.5rem;
  font-size: 2.1rem;
  font-weight: 700;
}

.role-indicator {
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
}

.error-message {
  background: #f87171;
  color: white;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.8rem;
  text-align: center;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(248,113,113,0.3);
  transition: all 0.3s ease;
}

.login-form {
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
  font-family: 'Inter', sans-serif;
}

.form-input:focus {
  outline: none;
  border-color: #e74c3c;
  box-shadow: 0 0 12px rgba(231,76,60,0.2);
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
}

.doctor-button {
  background: linear-gradient(135deg, #e74c3c, #d62828);
  color: white;
  box-shadow: 0 6px 18px rgba(231,76,60,0.35);
}

.doctor-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #d62828, #b91c1c);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(231,76,60,0.45);
}

.submit-button:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.switch-form {
  text-align: center;
  margin-bottom: 1.5rem;
}

.switch-button {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 600;
  transition: color 0.3s ease, transform 0.2s ease;
}

.switch-button:hover {
  color: #b91c1c;
  transform: translateY(-1px);
}

.back-to-home {
  text-align: center;
}

.back-button {
  background: none;
  border: none;
  color: #646f86ff;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.3s ease, transform 0.2s ease;
}

.back-button:hover {
  color: #c2d1e5ff;
  transform: translateY(-1px);
}

/* ------------------------
   Responsive Design
------------------------ */
@media screen and (max-width: 500px) {
  .login-card {
    padding: 2rem 2rem;
    max-width: 90%;
  }

  .login-header h2 {
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

export default DoctorLoginPage;
