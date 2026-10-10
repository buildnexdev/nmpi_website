import React, { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import { useLanguage } from '../context/LanguageContext';
import { ADMIN_URL, apiClient, downloadFile, errorMessage, formatDate, pick } from '../services/apiClient';
import { EmptyState, ErrorBox, Loader, PageHero } from '../components/ui';
import { DigitalIdCard } from '../components/DigitalIdCard';
import { formatIdCardDesignation, formatIdCardExpiry } from '../utils/idCardFormat';

interface MemberProfile {
  id: number;
  member_id: string;
  full_name: string;
  father_name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  country_code: string | null;
  phone_number: string;
  email: string | null;
  profile_image: string | null;
  blood_group: string | null;
  address_line1: string | null;
  village_custom: string | null;
  village_name: string | null;
  block_name: string | null;
  block_name_ta: string | null;
  district_name: string | null;
  district_name_ta: string | null;
  assembly_name: string | null;
  assembly_name_ta: string | null;
  parliament_name: string | null;
  parliament_name_ta: string | null;
  role_name: string | null;
  status: string;
  created_at: string;
  aadhaar_masked: string;
  voter_id_masked: string;
  qr_data_url: string | null;
}

const STATUS_CHIP: Record<string, string> = { APPROVED: 'chip-success', PENDING: 'chip-warning', REJECTED: 'chip-danger', SUSPENDED: 'chip-danger' };

const ChangePasswordCard: React.FC = () => {
  const { t } = useLanguage();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next.length < 8) return setMsg({ ok: false, text: t('profilePage.changePassword.tooShort') });
    if (next !== confirm) return setMsg({ ok: false, text: t('profilePage.changePassword.mismatch') });
    setSaving(true);
    setMsg(null);
    try {
      await apiClient.post('/auth/change-password', { current_password: current, new_password: next });
      setMsg({ ok: true, text: t('profilePage.changePassword.success') });
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (err) {
      setMsg({ ok: false, text: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card-custom p-4">
      <h2 className="h5 mb-3"><i className="bi bi-shield-lock me-2 text-maroon"></i>{t('profilePage.changePassword.title')}</h2>
      {msg && <div className={`alert small ${msg.ok ? 'alert-success' : 'alert-danger'}`} role="status">{msg.text}</div>}
      <form onSubmit={submit} className="row g-3">
        <div className="col-md-4">
          <label htmlFor="pw-current" className="form-label small fw-semibold">{t('profilePage.changePassword.current')}</label>
          <input id="pw-current" type="password" className="form-control" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
        </div>
        <div className="col-md-4">
          <label htmlFor="pw-new" className="form-label small fw-semibold">{t('profilePage.changePassword.new')}</label>
          <input id="pw-new" type="password" className="form-control" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} required />
        </div>
        <div className="col-md-4">
          <label htmlFor="pw-confirm" className="form-label small fw-semibold">{t('profilePage.changePassword.confirm')}</label>
          <input id="pw-confirm" type="password" className="form-control" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-outline-maroon" disabled={saving || !current || !next || !confirm}>
            {saving && <span className="spinner-border spinner-border-sm me-2"></span>}
            {t('profilePage.changePassword.submit')}
          </button>
        </div>
      </form>
    </div>
  );
};

export const ProfilePage: React.FC = () => {
  const { lang, t, tRaw } = useLanguage();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [noMember, setNoMember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const load = useCallback(() => {
    if (!isAuthenticated) return;
    setError(null);
    apiClient
      .get('/members/me')
      .then((r) => setProfile(r.data.data))
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 404) setNoMember(true);
        else setError(errorMessage(err));
      });
  }, [isAuthenticated]);
  useEffect(load, [load]);

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  const download = async () => {
    setDownloading(true);
    try {
      await downloadFile('/members/me/id-card', `${profile?.member_id || 'NMPI'}_ID_Card.pdf`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setDownloading(false);
    }
  };

  const header = (
    <PageHero
      eyebrow={t('profilePage.eyebrow')}
      title={t('profilePage.welcome', { name: profile?.full_name || user?.member?.full_name || user?.email || '' })}
      subtitle={t('profilePage.subtitle')}
    />
  );

  if (noMember) {
    return (
      <>
        {header}
        <section className="page-body">
          <div className="container">
            <EmptyState
              icon="bi-person-badge"
              title={t('profilePage.noMemberTitle')}
              text={t('profilePage.noMemberText')}
            >
              <div className="d-flex gap-2 justify-content-center mt-2">
                <a href={ADMIN_URL} className="btn btn-maroon">{t('profilePage.openAdminPortal')}</a>
                <button className="btn btn-outline-maroon" onClick={() => dispatch(logout())}>{t('profilePage.logout')}</button>
              </div>
            </EmptyState>
          </div>
        </section>
      </>
    );
  }

  const details: [string, React.ReactNode][] = profile
    ? [
        [t('profilePage.fields.memberId'), <code className="text-maroon">{profile.member_id}</code>],
        [t('profilePage.fields.mobile'), `${profile.country_code || ''} ${profile.phone_number}`.trim()],
        [t('profilePage.fields.email'), profile.email || '—'],
        [t('profilePage.fields.fatherName'), profile.father_name || '—'],
        [t('profilePage.fields.dateOfBirth'), profile.date_of_birth ? formatDate(profile.date_of_birth, lang) : '—'],
        [t('profilePage.fields.gender'), profile.gender || '—'],
        [t('profilePage.fields.bloodGroup'), profile.blood_group || '—'],
        [t('profilePage.fields.aadhaar'), profile.aadhaar_masked || '—'],
        [t('profilePage.fields.voterId'), profile.voter_id_masked || '—'],
        [t('profilePage.fields.parliament'), pick(profile, 'parliament_name', lang) || '—'],
        [t('profilePage.fields.assembly'), pick(profile, 'assembly_name', lang) || '—'],
        [t('profilePage.fields.district'), pick(profile, 'district_name', lang) || '—'],
        [t('profilePage.fields.block'), pick(profile, 'block_name', lang) || '—'],
        [t('profilePage.fields.village'), profile.village_name || profile.village_custom || '—'],
        [t('profilePage.fields.address'), profile.address_line1 || '—'],
        [t('profilePage.fields.joined'), formatDate(profile.created_at, lang)],
      ]
    : [];

  return (
    <>
      {header}
      <section className="page-body">
        <div className="container">
          {error && <div className="mb-4"><ErrorBox message={error} onRetry={profile ? undefined : load} /></div>}
          {!profile ? (
            !error && <Loader />
          ) : (
            <div className="row g-4">
              <div className="col-lg-5">
                <div className="position-sticky" style={{ top: 'calc(var(--header-h) + 16px)' }}>
                  <DigitalIdCard
                    fullName={profile.full_name}
                    memberId={profile.member_id}
                    designation={formatIdCardDesignation(profile)}
                    validUntil={formatIdCardExpiry(profile.created_at)}
                    bloodGroup={profile.blood_group}
                    profileImage={profile.profile_image}
                    qrDataUrl={profile.qr_data_url}
                  />
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <button className="btn btn-maroon flex-grow-1" onClick={download} disabled={downloading}>
                      {downloading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-download me-2"></i>}
                      {t('profilePage.downloadIdCard')}
                    </button>
                    <Link to="/events" className="btn btn-outline-maroon"><i className="bi bi-calendar-event me-1"></i>{t('nav.events')}</Link>
                  </div>
                  <p className="small text-muted mt-3 mb-0">
                    <i className="bi bi-qr-code me-1"></i>
                    {t('profilePage.qrNote')}
                  </p>
                </div>
              </div>
              <div className="col-lg-7 d-flex flex-column gap-4">
                <div className="card-custom p-4">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                    <h2 className="h5 mb-0"><i className="bi bi-person-vcard me-2 text-maroon"></i>{t('profilePage.membershipDetails')}</h2>
                    <span className={`chip ${STATUS_CHIP[profile.status] || ''}`}>{tRaw<Record<string, string>>('profilePage.status')?.[profile.status] || profile.status}</span>
                  </div>
                  {profile.status === 'PENDING' && (
                    <div className="alert alert-warning small">
                      {t('profilePage.pendingNotice')}
                    </div>
                  )}
                  <dl className="detail-grid mb-0">
                    {details.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <ChangePasswordCard />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
