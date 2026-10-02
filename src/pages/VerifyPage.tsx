import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import './VerifyPage.css';

export const VerifyPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const targetToken = token === 'demo' ? 'TOKEN-MEMBER-JD-VERIFY-2026-03' : token;
    if (targetToken) {
      apiClient.get(`/verify/member/${targetToken}`)
        .then(res => {
          setVerification(res.data.data);
          setLoading(false);
        })
        .catch(err => {
          setErrorMsg(err.response?.data?.message || 'Invalid or unverified QR verification token.');
          setLoading(false);
        });
    }
  }, [token]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-maroon mb-3" role="status"></div>
        <h4 className="text-maroon fw-bold">Validating QR Member Verification Token...</h4>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card-custom verify-card max-w-xl mx-auto p-4 p-md-5 text-center" style={{ maxWidth: 540 }}>
        {errorMsg ? (
          <div>
            <div className="bg-danger text-white rounded-circle p-3 d-inline-flex mb-3">
              <i className="bi bi-x-circle-fill fs-1"></i>
            </div>
            <h3 className="text-danger fw-bold">Verification Failed</h3>
            <p className="text-muted mb-4">{errorMsg}</p>
            <Link to="/" className="btn btn-outline-secondary">Return to Home</Link>
          </div>
        ) : (
          <div>
            <div className="verify-status-badge mb-3">
              <i className="bi bi-patch-check-fill text-success fs-5"></i>
              <span>VERIFIED OFFICIAL MEMBER</span>
            </div>

            <img
              src={verification?.profile_photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
              alt={verification?.full_name}
              className="rounded-circle mb-3 border border-gold"
              style={{ width: 110, height: 110, objectFit: 'cover' }}
            />

            <h3 className="h4 text-maroon fw-bold mb-1">{verification?.full_name}</h3>
            <div className="badge gold-badge fs-6 mb-3">{verification?.member_id}</div>

            <div className="bg-light p-3 rounded text-start mb-4 border">
              <div className="row g-2 small">
                <div className="col-6 text-muted">Membership Status:</div>
                <div className="col-6 fw-bold text-success">{verification?.status}</div>

                <div className="col-6 text-muted">Membership Tier:</div>
                <div className="col-6 fw-bold">{verification?.membership_type_name || 'Regular Member'}</div>

                <div className="col-6 text-muted">Joined Date:</div>
                <div className="col-6 fw-bold">{verification?.joining_date}</div>

                <div className="col-6 text-muted">Regional District:</div>
                <div className="col-6 fw-bold">{verification?.district_name}</div>

                <div className="col-6 text-muted">Local Unit:</div>
                <div className="col-6 fw-bold">{verification?.unit_name}</div>
              </div>
            </div>

            <div className="alert alert-info small text-start mb-4">
              <i className="bi bi-shield-lock-fill me-2 text-primary"></i>
              <strong>Privacy Protection Notice:</strong> In compliance with security standards, personal address details and contact numbers are shielded from public QR scan views.
            </div>

            <Link to="/" className="btn btn-maroon w-100">
              Back to Community Platform
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
