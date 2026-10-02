import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { apiClient } from '../services/apiClient';
import './ProfilePage.css';

export const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [profile, setProfile] = useState<any>(null);
  const [qrData, setQrData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/members/me')
      .then(res => {
        setProfile(res.data.data);
        if (res.data.data?.id) {
          apiClient.get(`/members/${res.data.data.id}/qr`)
            .then(qrRes => setQrData(qrRes.data.data))
            .catch(() => {});
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="container py-5 text-center"><div className="spinner-border text-maroon"></div></div>;
  }

  const activeProfile = profile || {
    full_name: user?.member?.full_name || 'Verified Member',
    member_id: user?.member?.member_id || 'ORG-2026-000003',
    status: user?.member?.status || 'APPROVED',
    district_name: 'Central Capital District',
    unit_name: 'Unit 01 - Civic Center',
    membership_type_name: 'Life Member',
    joining_date: '2026-01-01',
    profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Left Col: Digital Identity Card */}
        <div className="col-lg-5">
          <div className="h5 text-maroon fw-bold mb-3"><i className="bi bi-card-heading me-2"></i>Official Digital Member ID Card</div>
          
          <div className="digital-id-card-front p-4 mb-3">
            <div className="digital-id-header d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-shield-check text-gold fs-3"></i>
                <span className="fw-bold tracking-wider text-gold small">COMMUNITY PLATFORM</span>
              </div>
              <span className="badge bg-gold text-maroon font-bold">VERIFIED</span>
            </div>

            <div className="d-flex gap-3 align-items-center mb-3">
              <img
                src={activeProfile.profile_photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
                alt={activeProfile.full_name}
                className="id-photo"
              />
              <div>
                <h4 className="h5 fw-bold text-white mb-1">{activeProfile.full_name}</h4>
                <div className="text-gold fw-bold small mb-1">{activeProfile.member_id}</div>
                <div className="small text-white-50">{activeProfile.unit_name || 'Unit 01'}</div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-end pt-3 border-top border-secondary">
              <div className="small">
                <div className="text-gold" style={{ fontSize: '0.75rem' }}>DISTRICT JURISDICTION</div>
                <div className="fw-semibold">{activeProfile.district_name || 'Central District'}</div>
              </div>

              {qrData?.qr_data_url ? (
                <img src={qrData.qr_data_url} alt="QR Verification" className="bg-white p-1 rounded" style={{ width: 70, height: 70 }} />
              ) : (
                <div className="bg-white p-1 rounded text-dark text-center" style={{ width: 70, height: 70 }}>
                  <i className="bi bi-qr-code fs-1 text-maroon"></i>
                </div>
              )}
            </div>
          </div>

          <button className="btn btn-outline-secondary w-100" onClick={() => window.print()}>
            <i className="bi bi-download me-2"></i>Download Digital ID Card (PDF / Print)
          </button>
        </div>

        {/* Right Col: Member Account Overview */}
        <div className="col-lg-7">
          <div className="card-custom p-4">
            <h5 className="text-maroon fw-bold mb-4 pb-2 border-bottom">Member Account & Security</h5>
            
            <div className="row g-3 small mb-4">
              <div className="col-md-6">
                <label className="text-muted d-block">Full Name</label>
                <span className="fw-bold">{activeProfile.full_name}</span>
              </div>
              <div className="col-md-6">
                <label className="text-muted d-block">Member ID</label>
                <span className="fw-bold text-gold">{activeProfile.member_id || 'Pending Generation'}</span>
              </div>
              <div className="col-md-6">
                <label className="text-muted d-block">Application Status</label>
                <span className="badge bg-success">{activeProfile.status}</span>
              </div>
              <div className="col-md-6">
                <label className="text-muted d-block">Membership Type</label>
                <span className="fw-bold">{activeProfile.membership_type_name || 'Regular'}</span>
              </div>
              <div className="col-md-6">
                <label className="text-muted d-block">District</label>
                <span className="fw-bold">{activeProfile.district_name || 'Central Capital'}</span>
              </div>
              <div className="col-md-6">
                <label className="text-muted d-block">Local Unit</label>
                <span className="fw-bold">{activeProfile.unit_name || 'Unit 01'}</span>
              </div>
            </div>

            <div className="alert alert-warning small">
              <i className="bi bi-shield-exclamation me-2"></i>
              To update your registered mobile number or regional unit assignment, submit an amendment request through your local unit officer.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
