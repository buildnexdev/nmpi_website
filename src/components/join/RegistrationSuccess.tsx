import React, { useState } from 'react';
import { downloadFile, errorMessage } from '../../services/apiClient';
import { formatIdCardDesignation, formatIdCardExpiry } from '../../utils/idCardFormat';
import { RegisteredMember } from '../../services/memberService';
import { DigitalIdCard } from '../DigitalIdCard';
import { useLanguage } from '../../context/LanguageContext';

interface RegistrationSuccessProps {
  member: RegisteredMember;
  onLogin: () => void;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({ member, onLogin }) => {
  const { t } = useLanguage();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = async () => {
    setDownloading(true);
    setError(null);
    try {
      const token = member.id_card_token || member.verification_token;
      const url = token
        ? `/members/id-card/download?token=${encodeURIComponent(token)}`
        : `/members/${encodeURIComponent(member.member_id)}/id-card`;
      await downloadFile(url, `${member.member_id}_ID_Card.pdf`);
    } catch (err) {
      setError(errorMessage(err, '') || t('registrationSuccess.downloadExpired'));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="card-custom p-4 p-md-5 mx-auto" style={{ maxWidth: 680 }}>
      <div className="text-center mb-4">
        <div className="feature-icon gold mx-auto mb-3" style={{ width: 72, height: 72, fontSize: '2rem' }}>
          <i className="bi bi-check2-circle"></i>
        </div>
        <h1 className="h3 mb-1">{t('registrationSuccess.title')}</h1>
        <p className="text-muted mb-0">
          {t('registrationSuccess.welcome')}, <strong>{member.full_name}</strong>.
        </p>
      </div>

      <div className="mx-auto mb-4" style={{ maxWidth: 460 }}>
        <DigitalIdCard
          fullName={member.full_name}
          memberId={member.member_id}
          designation={formatIdCardDesignation(member)}
          validUntil={formatIdCardExpiry(member.created_at)}
          phone={member.phone_number}
          countryCode={member.country_code}
          bloodGroup={member.blood_group}
          profileImage={member.profile_image}
        />
      </div>

      <div className="alert alert-light border small d-flex gap-2">
        <i className="bi bi-info-circle text-maroon"></i>
        <div>{t('registrationSuccess.keepIdSafe')}</div>
      </div>

      {error && <div className="alert alert-danger small" role="alert">{error}</div>}

      <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
        <button type="button" className="btn btn-maroon btn-lg px-4" onClick={download} disabled={downloading}>
          {downloading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-file-earmark-pdf me-2"></i>}
          {t('registrationSuccess.downloadIdCard')}
        </button>
        <button type="button" className="btn btn-outline-maroon btn-lg px-4" onClick={onLogin}>
          <i className="bi bi-box-arrow-in-right me-2"></i>
          {t('registrationSuccess.logIn')}
        </button>
      </div>
    </div>
  );
};
