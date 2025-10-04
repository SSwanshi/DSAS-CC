// src/components/common/ApprovalMessage.js
import React from 'react';
import './ApprovalMessage.css';

const ApprovalMessage = ({ user, children }) => {
  // If user is admin or approved, show children normally
  if (user.role === 'admin' || user.isApproved) {
    return children;
  }

  // If user is not approved, show approval message
  return (
    <div className="approval-message-container">
      <div className="approval-message">
        <div className="approval-icon">⏳</div>
        <h3>Account Pending Approval</h3>
        <p>
          Your {user.role} account is currently pending approval from the administrator. 
          You will be able to access all features once your account is approved.
        </p>
        <div className="approval-actions">
          <button 
            onClick={() => window.location.href = '/'}
            className="approval-button"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalMessage;
