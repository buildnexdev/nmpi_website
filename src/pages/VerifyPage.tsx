import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { apiClient, errorMessage, formatDate, mediaUrl, pick } from '../services/apiClient';
import { Loader } from '../components/ui';

interface VerifiedMember {
  member_id: string;
  full_name: string;
  gender: string | null;
  profile_image: string | null;
  blood_group: string | null;
  status: string;
  created_at: string;
  parliament_name: string | null;
  parliament_name_ta: string | null;
  assembly_name: string | null;
  assembly_name_ta: string | null;
  district_name: string | null;
  district_name_ta: string | null;
  block_name: string | null;
  block_name_ta: string | null;
  village_name: string | null;
  role_name: string | null;
}

const VERDICT: Record<string, { icon: string; cls: string; ta: string; en: string; noteTa: string; noteEn: string }> = {
  APPROVED: { icon: 'bi-patch-check-fill', cls: 'text-success', ta: 'சரிபார்க்கப்பட்ட உறுப்பினர்', en: 'Verified member', noteTa: 'இந்த நபர் இயக்கத்தின் செயலில் உள்ள அங்கீகரிக்கப்பட்ட உறுப்பினர்.', noteEn: 'This person is an active, approved member of the organisation.' },
  PENDING: { icon: 'bi-hourglass-split', cls: 'text-warning', ta: 'அங்கீகாரம் நிலுவையில்', en: 'Approval pending', noteTa: 'பதிவு உண்மையானது, ஆனால் இன்னும் அங்கீகரிக்கப்படவில்லை.', noteEn: 'This registration is genuine but has not been approved yet.' },
  REJECTED: { icon: 'bi-x-octagon-fill', cls: 'text-danger', ta: 'செல்லாத உறுப்பினர்', en: 'Not a valid member', noteTa: 'இந்தப் பதிவு நிராகரிக்கப்பட்டது.', noteEn: 'This registration was rejected.' },
  SUSPENDED: { icon: 'bi-slash-circle-fill', cls: 'text-danger', ta: 'இடைநீக்கம் செய்யப்பட்டது', en: 'Membership suspended', noteTa: 'இந்த உறுப்பினர் தற்போது இடைநீக்கத்தில் உள்ளார்.', noteEn: 'This membership is currently suspended.' },
};

export const VerifyPage: React.FC = () => {
  const { token } = useParams();
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const [member, setMember] = useState<VerifiedMember | null>(null);
  const [error, setError] = useState<{ notFound: boolean; message: string } | null>(null);

  useEffect(() => {
    setMember(null);
    setError(null);
    apiClient
      .get(`/verify/${encodeURIComponent(token || '')}`)
      .then((r) => setMember(r.data.data))
      .catch((err) => setError({ notFound: axios.isAxiosError(err) && err.response?.status === 404, message: errorMessage(err) }));
  }, [token]);

  const verdict = member ? VERDICT[member.status] || VERDICT.PENDING : null;
  const rows: [string, string | null][] = member
    ? [
        [ta ? 'உறுப்பினர் எண்' : 'Member ID', member.member_id],
        [ta ? 'பொறுப்பு' : 'Role', member.role_name],
        [ta ? 'மாவட்டம்' : 'District', pick(member, 'district_name', lang)],
        [ta ? 'ஒன்றியம்' : 'Block / taluk', pick(member, 'block_name', lang)],
        [ta ? 'நாடாளுமன்றத் தொகுதி' : 'Parliament constituency', pick(member, 'parliament_name', lang)],
        [ta ? 'இரத்த வகை' : 'Blood group', member.blood_group],
        [ta ? 'உறுப்பினரான தேதி' : 'Member since', formatDate(member.created_at, lang)],
      ]
    : [];

  return (
    <section className="page-body" style={{ background: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: 560 }}>
        <div className="text-center mb-4">
          <img src="/logo.jpg" alt="NMPI" width={56} height={56} className="rounded-circle mb-2" />
          <div className="eyebrow">{ta ? 'உறுப்பினர் சரிபார்ப்பு' : 'Member verification'}</div>
        </div>

        {!member && !error && <Loader label={ta ? 'சரிபார்க்கிறது...' : 'Verifying...'} />}

        {error && (
          <div className="card-custom p-4 p-md-5 text-center">
            <i className={`bi ${error.notFound ? 'bi-shield-x text-danger' : 'bi-wifi-off text-muted'}`} style={{ fontSize: '3.5rem' }}></i>
            <h1 className="h4 mt-3">{error.notFound ? (ta ? 'செல்லாத QR குறியீடு' : 'Invalid QR code') : (ta ? 'சரிபார்க்க முடியவில்லை' : 'Could not verify')}</h1>
            <p className="text-muted mb-4">
              {error.notFound
                ? ta ? 'இந்த QR குறியீடு எந்த உறுப்பினருடனும் பொருந்தவில்லை. அட்டை போலியானதாக இருக்கலாம்.' : 'This QR code does not match any member. The card may not be genuine.'
                : error.message}
            </p>
            <Link to="/" className="btn btn-outline-maroon">{ta ? 'முகப்பு' : 'Go to homepage'}</Link>
          </div>
        )}

        {member && verdict && (
          <div className="card-custom overflow-hidden">
            <div className="p-4 text-center" style={{ background: 'linear-gradient(145deg, #2a0009, var(--primary-maroon))', color: '#fff' }}>
              {member.profile_image ? (
                <img src={mediaUrl(member.profile_image)} alt={member.full_name} className="rounded-3 border border-2 border-warning" style={{ width: 112, height: 132, objectFit: 'cover' }} />
              ) : (
                <div className="d-inline-flex align-items-center justify-content-center rounded-3 border border-2 border-warning" style={{ width: 112, height: 132, background: 'rgba(255,255,255,.1)' }}>
                  <i className="bi bi-person fs-1 text-white-50"></i>
                </div>
              )}
              <h1 className="h3 text-white mt-3 mb-1">{member.full_name}</h1>
              <code className="text-gold fw-bold">{member.member_id}</code>
            </div>
            <div className="p-4">
              <div className="d-flex align-items-center gap-3 p-3 rounded-3 mb-4" style={{ background: 'var(--color-bg)' }}>
                <i className={`bi ${verdict.icon} ${verdict.cls}`} style={{ fontSize: '2.2rem' }}></i>
                <div>
                  <div className={`fw-bold ${verdict.cls}`}>{ta ? verdict.ta : verdict.en}</div>
                  <div className="small text-muted">{ta ? verdict.noteTa : verdict.noteEn}</div>
                </div>
              </div>
              <dl className="detail-grid mb-0">
                {rows.filter(([, v]) => v).map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="px-4 py-3 border-top small text-muted text-center">
              <i className="bi bi-clock me-1"></i>
              {ta ? 'சரிபார்த்த நேரம்' : 'Checked at'} {new Date().toLocaleString(ta ? 'ta-IN' : 'en-IN')}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
