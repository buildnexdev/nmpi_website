import React, { useState } from 'react';
import { downloadFile, errorMessage, pick } from '../../services/apiClient';
import { DigitalIdCard } from '../DigitalIdCard';

interface RegistrationSuccessProps {
  member: any;
  lang?: 'ta' | 'en';
  onLogin: () => void;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({ member, lang = 'ta', onLogin }) => {
  const ta = lang === 'ta';
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = async () => {
    setDownloading(true);
    setError(null);
    try {
      await downloadFile(`/members/id-card/download?token=${encodeURIComponent(member.id_card_token)}`, `${member.member_id}_ID_Card.pdf`);
    } catch (err) {
      setError(
        errorMessage(err, '') ||
          (ta ? 'பதிவிறக்க இணைப்பு காலாவதியானது. உள்நுழைந்து உங்கள் சுயவிவரத்திலிருந்து பதிவிறக்கவும்.' : 'The download link has expired. Log in and download it from your profile.')
      );
    } finally {
      setDownloading(false);
    }
  };

  const location = [member.village_name || member.village_custom, pick(member, 'block_name', lang), pick(member, 'district_name', lang)].filter(Boolean).join(', ');

  return (
    <div className="card-custom p-4 p-md-5 mx-auto" style={{ maxWidth: 680 }}>
      <div className="text-center mb-4">
        <div className="feature-icon gold mx-auto mb-3" style={{ width: 72, height: 72, fontSize: '2rem' }}>
          <i className="bi bi-check2-circle"></i>
        </div>
        <h1 className="h3 mb-1">{ta ? 'பதிவு வெற்றிகரமாக முடிந்தது!' : 'Registration complete!'}</h1>
        <p className="text-muted mb-0">
          {ta ? 'இயக்கத்திற்கு வரவேற்கிறோம்' : 'Welcome to the movement'}, <strong>{member.full_name}</strong>.
        </p>
      </div>

      <div className="mx-auto mb-4" style={{ maxWidth: 460 }}>
        <DigitalIdCard
          fullName={member.full_name}
          memberId={member.member_id}
          roleName={member.role_name}
          location={location}
          bloodGroup={member.blood_group !== 'Unknown' ? member.blood_group : null}
          profileImage={member.profile_image}
        />
      </div>

      <div className="alert alert-light border small d-flex gap-2">
        <i className="bi bi-info-circle text-maroon"></i>
        <div>
          {ta
            ? 'உங்கள் உறுப்பினர் எண்ணைக் குறித்துக்கொள்ளுங்கள். QR குறியீட்டுடன் கூடிய அதிகாரப்பூர்வ அட்டையை இப்போது பதிவிறக்கலாம்; பின்னர் உள்நுழைந்து எப்போது வேண்டுமானாலும் பெறலாம்.'
            : 'Keep your member ID safe. Download the official card with its QR code now, or log in any time to get it again.'}
        </div>
      </div>

      {error && <div className="alert alert-danger small" role="alert">{error}</div>}

      <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
        <button type="button" className="btn btn-maroon btn-lg px-4" onClick={download} disabled={downloading}>
          {downloading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-file-earmark-pdf me-2"></i>}
          {ta ? 'அடையாள அட்டை பதிவிறக்கம்' : 'Download ID card (PDF)'}
        </button>
        <button type="button" className="btn btn-outline-maroon btn-lg px-4" onClick={onLogin}>
          <i className="bi bi-box-arrow-in-right me-2"></i>
          {ta ? 'உள்நுழைக' : 'Log in to your account'}
        </button>
      </div>
    </div>
  );
};
