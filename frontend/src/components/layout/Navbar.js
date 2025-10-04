// src/components/layout/Navbar.js
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          DSAS 🩺
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink to="/" className="nav-links">
              Home
            </NavLink>
          </li>
          
          {!user ? (
            <>
              <li className="nav-item">
                <Link to="/doctor-login" className="nav-links nav-button">
                  Doctor
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/patient-login" className="nav-links nav-button">
                  Patient
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin-login" className="nav-links nav-button admin-button">
                  Cloud Server
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link 
                  to={
                    user.role === 'patient' ? '/patient-home' :
                    user.role === 'doctor' ? '/doctor-home' :
                    user.role === 'admin' ? '/admin-home' : '/'
                  } 
                  className="nav-links"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <span className="nav-user">
                  Welcome, {user.firstName} {user.lastName}
                  {user.role !== 'admin' && !user.isApproved && (
                    <span className="approval-status pending">⏳ Pending Approval</span>
                  )}
                </span>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-links nav-button logout-button">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;