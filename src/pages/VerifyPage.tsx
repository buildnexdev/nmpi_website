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

const VERDICT: Record<string, { icon: string; cls: string }> = {
  APPROVED: { icon: 'bi-patch-check-fill', cls: 'text-success' },
  PENDING: { icon: 'bi-hourglass-split', cls: 'text-warning' },
  REJECTED: { icon: 'bi-x-octagon-fill', cls: 'text-danger' },
  SUSPENDED: { icon: 'bi-slash-circle-fill', cls: 'text-danger' },
};

export const VerifyPage: React.FC = () => {
  const { token } = useParams();
  const { lang, t } = useLanguage();
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

  const verdictKey = member && VERDICT[member.status] ? member.status : 'PENDING';
  const verdict = member ? VERDICT[verdictKey] : null;
  const rows: [string, string | null][] = member
    ? [
        [t('verifyPage.fields.memberId'), member.member_id],
        [t('verifyPage.fields.role'), member.role_name],
        [t('verifyPage.fields.district'), pick(member, 'district_name', lang)],
        [t('verifyPage.fields.block'), pick(member, 'block_name', lang)],
        [t('verifyPage.fields.parliament'), pick(member, 'parliament_name', lang)],
        [t('verifyPage.fields.bloodGroup'), member.blood_group],
        [t('verifyPage.fields.memberSince'), formatDate(member.created_at, lang)],
      ]
    : [];

  return (
    <section className="page-body" style={{ background: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: 560 }}>
        <div className="text-center mb-4">
          <img src="/logo.jpg" alt={t('verifyPage.logoAlt')} width={56} height={56} className="rounded-circle mb-2" />
          <div className="eyebrow">{t('verifyPage.eyebrow')}</div>
        </div>

        {!member && !error && <Loader label={t('verifyPage.verifying')} />}

        {error && (
          <div className="card-custom p-4 p-md-5 text-center">
            <i className={`bi ${error.notFound ? 'bi-shield-x text-danger' : 'bi-wifi-off text-muted'}`} style={{ fontSize: '3.5rem' }}></i>
            <h1 className="h4 mt-3">{error.notFound ? t('verifyPage.invalidQrTitle') : t('verifyPage.couldNotVerify')}</h1>
            <p className="text-muted mb-4">
              {error.notFound ? t('verifyPage.invalidQrText') : error.message}
            </p>
            <Link to="/" className="btn btn-outline-maroon">{t('verifyPage.goHome')}</Link>
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
                  <div className={`fw-bold ${verdict.cls}`}>{t(`verifyPage.verdicts.${verdictKey}.title`)}</div>
                  <div className="small text-muted">{t(`verifyPage.verdicts.${verdictKey}.note`)}</div>
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
              {t('verifyPage.checkedAt', { time: new Date().toLocaleString(lang === 'ta' ? 'ta-IN' : 'en-IN') })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
