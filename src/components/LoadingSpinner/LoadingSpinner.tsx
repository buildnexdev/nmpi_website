import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = true, message = 'Loading...' }) => {
  if (!fullScreen) {
    return (
      <div className="d-flex align-items-center justify-content-center p-4">
        <div className="spinner-border text-maroon me-2" role="status"></div>
        <span className="text-maroon fw-semibold">{message}</span>
      </div>
    );
  }

  return (
    <>
      <div className="spinner-top-bar"></div>
      <div className="global-spinner-overlay">
        <img src="/logo.jpg" alt="Logo" className="spinner-logo-pulse mb-3" />
        <div className="spinner-border text-gold mb-2" role="status" style={{ width: '2rem', height: '2rem' }}></div>
        <div className="text-white fw-bold tracking-wider small text-uppercase">{message}</div>
      </div>
    </>
  );
};
