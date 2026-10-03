import React from 'react';
import { mediaUrl } from '../services/apiClient';

interface Props {
  fullName: string;
  memberId: string;
  roleName?: string | null;
  location?: string | null;
  bloodGroup?: string | null;
  profileImage?: string | null;
  qrDataUrl?: string | null;
}

export const DigitalIdCard: React.FC<Props> = ({ fullName, memberId, roleName, location, bloodGroup, profileImage, qrDataUrl }) => (
  <div className="id-card" aria-label="Digital member ID card">
    <div className="id-card-head">
      <img src="/logo.jpg" alt="" />
      <div className="id-card-org">
        Netaji Makkal Pathukappu Iyakkam
        <small>Member identity card</small>
      </div>
    </div>
    <div className="id-card-main">
      {profileImage ? (
        <img className="id-card-photo" src={mediaUrl(profileImage)} alt={fullName} />
      ) : (
        <div className="id-card-photo d-flex align-items-center justify-content-center">
          <i className="bi bi-person fs-1 text-white-50"></i>
        </div>
      )}
      <div className="min-w-0 flex-grow-1">
        <div className="id-card-name text-truncate">{fullName}</div>
        <div className="id-card-id">{memberId}</div>
        <div className="id-card-meta mt-1">
          {roleName || 'Member'}
          {bloodGroup && <> · <i className="bi bi-droplet-fill"></i> {bloodGroup}</>}
        </div>
        {location && <div className="id-card-meta text-truncate">{location}</div>}
      </div>
      {qrDataUrl && <img className="id-card-qr" src={qrDataUrl} alt="Verification QR code" />}
    </div>
  </div>
);
