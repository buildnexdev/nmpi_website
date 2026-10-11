import React from 'react';
import { mediaUrl } from '../services/apiClient';
import { useLanguage } from '../context/LanguageContext';
import { formatIdCardBloodGroup } from '../utils/idCardFormat';
import { idCardBoxStyle, idCardPhotoStyle, idCardQrStyle } from '../utils/idCardLayout';
import './DigitalIdCard.css';

interface Props {
  fullName: string;
  memberId: string;
  designation: string;
  validUntil: string;
  bloodGroup?: string | null;
  profileImage?: string | null;
  qrDataUrl?: string | null;
}

export const DigitalIdCard: React.FC<Props> = ({
  fullName,
  memberId,
  designation,
  validUntil,
  bloodGroup,
  profileImage,
  qrDataUrl,
}) => {
  const { t } = useLanguage();
  const photo = mediaUrl(profileImage);

  return (
    <div className="nmpi-id-card" aria-label={t('idCard.ariaLabel')}>
      <img className="nmpi-id-card-bg" src="/id-card-template.jpg" alt="" draggable={false} />
      <div className={`nmpi-id-card-photo-wrap ${photo ? '' : 'is-empty'}`} style={idCardPhotoStyle()}>
        {photo ? (
          <img className="nmpi-id-card-photo" src={photo} alt={fullName} loading="lazy" />
        ) : (
          <i className="bi bi-person" aria-hidden="true"></i>
        )}
      </div>
      <p className="nmpi-id-card-slot name" style={idCardBoxStyle('name')}>
        <span>{fullName.trim() || '—'}</span>
      </p>
      <p className="nmpi-id-card-slot member-id" style={idCardBoxStyle('memberId')}>
        <span>{memberId}</span>
      </p>
      <p className="nmpi-id-card-slot designation" style={idCardBoxStyle('designation')}>
        <span>{designation}</span>
      </p>
      <p className="nmpi-id-card-slot blood" style={idCardBoxStyle('bloodGroup')}>
        <span>{formatIdCardBloodGroup(bloodGroup)}</span>
      </p>
      <p className="nmpi-id-card-slot expiry" style={idCardBoxStyle('expiry')}>
        <span>{validUntil}</span>
      </p>
      {qrDataUrl && (
        <div className="nmpi-id-card-qr-wrap" style={idCardQrStyle()}>
          <img className="nmpi-id-card-qr" src={qrDataUrl} alt={t('idCard.qrAlt')} />
        </div>
      )}
    </div>
  );
};
