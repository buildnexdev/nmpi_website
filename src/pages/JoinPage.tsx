import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form, FormikTouched } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { Language, translate, useLanguage } from '../context/LanguageContext';
import { memberService, RegisterMemberPayload, RegisteredMember } from '../services/memberService';
import { errorMessage, downloadFile } from '../services/apiClient';
import { setCredentials } from '../store/authSlice';
import { PageHero } from '../components/ui';
import { PersonalInformationForm } from '../components/join/PersonalInformationForm';
import { IdentityLocationForm } from '../components/join/IdentityLocationForm';
import { RegistrationSuccess } from '../components/join/RegistrationSuccess';
import { DuplicateChecker, DuplicateField } from '../components/join/duplicateCheck';
import { roleIdFromJoinAsText } from '../components/join/joinAsRole';
import { MemberProfileEditForm, ProfileForEdit } from '../components/profile/MemberProfileEditForm';
import { DigitalIdCard } from '../components/DigitalIdCard';
import { formatIdCardDesignation, formatIdCardExpiry } from '../utils/idCardFormat';

type JoinValues = RegisterMemberPayload & { confirm_password: string; consent_terms: boolean; join_as: string };

const ALL_FIELDS = [
  'full_name', 'father_name', 'date_of_birth', 'gender', 'country_code', 'phone_number', 'email',
  'password', 'confirm_password', 'blood_group', 'profile_image',
  'aadhaar_number', 'voter_id', 'join_as', 'parliament_constituency_id', 'district_id', 'block_id', 'consent_terms',
];
const DUP_FIELDS: DuplicateField[] = ['phone_number', 'email', 'aadhaar_number', 'voter_id'];

function cleanValue(field: DuplicateField, values: JoinValues): string {
  switch (field) {
    case 'phone_number':
      return (values.phone_number || '').replace(/\D/g, '');
    case 'email':
      return (values.email || '').trim().toLowerCase();
    case 'aadhaar_number':
      return (values.aadhaar_number || '').replace(/\D/g, '');
    case 'voter_id':
      return (values.voter_id || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  }
}

function isCheckable(field: DuplicateField, value: string): boolean {
  switch (field) {
    case 'phone_number':
      return /^\d{10}$/.test(value);
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case 'aadhaar_number':
      return /^\d{12}$/.test(value);
    case 'voter_id':
      return value.length >= 6;
  }
}

const DUP_MESSAGE_KEYS: Record<DuplicateField, string> = {
  phone_number: 'joinPage.duplicates.phoneNumber',
  email: 'joinPage.duplicates.email',
  aadhaar_number: 'joinPage.duplicates.aadhaarNumber',
  voter_id: 'joinPage.duplicates.voterId',
};

function isAdult(value?: string) {
  if (!value) return false;
  const dob = new Date(`${value}T00:00:00`);
  if (Number.isNaN(dob.getTime())) return false;
  const adult = new Date(dob);
  adult.setFullYear(dob.getFullYear() + 18);
  return adult <= new Date();
}

const buildSchema = (lang: Language) => {
  const msg = (key: string) => translate(lang, `joinForm.validation.${key}`);
  const selectRequired = (key: string) =>
    yup.number().transform((v, orig) => (orig === '' ? undefined : v)).typeError(msg(key)).positive(msg(key)).required(msg(key));

  return yup.object({
    full_name: yup.string().trim().min(2, msg('fullNameMin')).required(msg('fullNameRequired')),
    father_name: yup.string().trim().required(msg('fatherNameRequired')),
    date_of_birth: yup.string().required(msg('dobRequired')).test('adult', msg('dobAdult'), isAdult),
    gender: yup.string().oneOf(['MALE', 'FEMALE', 'OTHER']).required(),
    country_code: yup.string().required(),
    phone_number: yup.string().transform((v) => (v ? v.replace(/\D/g, '') : v)).matches(/^\d{10}$/, msg('phoneInvalid')).required(msg('phoneRequired')),
    email: yup.string().trim().email(msg('emailInvalid')).required(msg('emailRequired')),
    password: yup.string().min(8, msg('passwordMin')).required(msg('passwordRequired')),
    confirm_password: yup.string().oneOf([yup.ref('password')], msg('passwordMismatch')).required(msg('confirmPasswordRequired')),
    profile_image: yup.mixed().required(msg('profilePhotoRequired')).test('file', msg('profilePhotoRequired'), (v) => v instanceof File),
    aadhaar_number: yup
      .string()
      .required(msg('aadhaarRequired'))
      .matches(/^\d{12}$/, msg('aadhaarInvalid')),
    voter_id: yup
      .string()
      .transform((v) => (v ? String(v).replace(/[^A-Za-z0-9]/g, '').toUpperCase() : ''))
      .min(6, msg('voterIdMin'))
      .required(msg('voterIdRequired')),
    parliament_constituency_id: selectRequired('parliamentRequired'),
    district_id: selectRequired('districtRequired'),
    block_id: selectRequired('blockRequired'),
    join_as: yup.string().trim().min(2, msg('roleRequired')).max(100).required(msg('roleRequired')),
    consent_terms: yup.boolean().oneOf([true], msg('consentRequired')),
  });
};

const initialValues: JoinValues = {
  full_name: '',
  father_name: '',
  date_of_birth: '',
  gender: 'MALE',
  country_code: '+91',
  phone_number: '',
  email: '',
  password: '',
  confirm_password: '',
  blood_group: 'Unknown',
  profile_image: null,
  aadhaar_number: '',
  voter_id: '',
  state_id: 1,
  parliament_constituency_id: '' as unknown as number,
  assembly_constituency_id: undefined,
  district_id: '' as unknown as number,
  block_id: '' as unknown as number,
  village_id: '',
  village_custom: '',
  address_line1: '',
  join_as: '',
  role_id: 1,
  consent_terms: false,
};

export const JoinPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registeredMember, setRegisteredMember] = useState<RegisteredMember | null>(null);
  const [editingMember, setEditingMember] = useState<RegisteredMember | null>(null);
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const schema = useMemo(() => buildSchema(lang), [lang]);

  const profileForEdit: ProfileForEdit = useMemo(() => {
    if (!editingMember) {
      return {
        full_name: '',
        father_name: null,
        date_of_birth: null,
        gender: null,
        blood_group: null,
        profile_image: null,
      };
    }
    return {
      full_name: editingMember.full_name,
      father_name: editingMember.father_name || null,
      date_of_birth: editingMember.date_of_birth || null,
      gender: editingMember.gender || null,
      blood_group: editingMember.blood_group || null,
      profile_image: editingMember.profile_image || null,
      state_id: editingMember.state_id || 1,
      parliament_constituency_id: editingMember.parliament_constituency_id,
      assembly_constituency_id: editingMember.assembly_constituency_id,
      district_id: editingMember.district_id,
      block_id: editingMember.block_id,
      village_id: editingMember.village_id,
      village_custom: editingMember.village_custom,
      address_line1: editingMember.address_line1,
      role_id: editingMember.role_id,
      role_name: editingMember.role_name,
      designation: editingMember.designation,
    };
  }, [editingMember]);

  const [dupErrors, setDupErrors] = useState<Partial<Record<DuplicateField, string>>>({});
  const [dupChecking, setDupChecking] = useState<Partial<Record<DuplicateField, boolean>>>({});
  const lastChecked = useRef<Partial<Record<DuplicateField, { value: string; exists: boolean }>>>({});

  const clearDuplicate = useCallback((field: DuplicateField) => {
    setDupErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const checkDuplicate = useCallback(
    async (field: DuplicateField, values: JoinValues): Promise<boolean> => {
      const value = cleanValue(field, values);
      if (!isCheckable(field, value)) {
        clearDuplicate(field);
        return false;
      }
      const cacheKey = field === 'phone_number' ? `${values.country_code}|${value}` : value;
      const cached = lastChecked.current[field];
      if (cached && cached.value === cacheKey) {
        if (cached.exists) setDupErrors((prev) => ({ ...prev, [field]: translate(lang, DUP_MESSAGE_KEYS[field]) }));
        return cached.exists;
      }
      setDupChecking((prev) => ({ ...prev, [field]: true }));
      try {
        let exists = false;
        if (field === 'phone_number') exists = (await memberService.checkPhone(values.country_code || '+91', value)).exists;
        else if (field === 'email') exists = (await memberService.checkEmail(value)).exists;
        else if (field === 'aadhaar_number') exists = (await memberService.checkAadhaar(value)).exists;
        else exists = (await memberService.checkVoterId(value)).exists;
        lastChecked.current[field] = { value: cacheKey, exists };
        if (exists) setDupErrors((prev) => ({ ...prev, [field]: translate(lang, DUP_MESSAGE_KEYS[field]) }));
        else clearDuplicate(field);
        return exists;
      } catch {
        return false;
      } finally {
        setDupChecking((prev) => ({ ...prev, [field]: false }));
      }
    },
    [clearDuplicate, lang]
  );

  const duplicates: DuplicateChecker = { errors: dupErrors, checking: dupChecking, check: checkDuplicate, clear: clearDuplicate };

  const failOn = (field: string, message: string, setFieldError: (f: string, m: string) => void) => {
    setSubmitError(message);
    setFieldError(field, message);
    if (field in DUP_MESSAGE_KEYS) setDupErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = lookupPhone.replace(/\D/g, '');
    if (clean.length !== 10) {
      setLookupError(t('joinForm.validation.phoneInvalid'));
      return;
    }
    setLookupLoading(true);
    setLookupError(null);
    try {
      const res = await memberService.lookupByPhone(clean);
      dispatch(setCredentials({ token: res.token, user: res.user }));
      setEditingMember(res.member);
      setShowLookupModal(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      const msg = errorMessage(err, t('joinPage.phoneNotFound'));
      setLookupError(msg);
    } finally {
      setLookupLoading(false);
    }
  };

  const handleSubmit = async (values: JoinValues, { setSubmitting, setFieldError, setTouched }: any) => {
    setSubmitError(null);
    setTouched(Object.fromEntries(ALL_FIELDS.map((f) => [f, true])) as FormikTouched<JoinValues>);
    try {
      const results = await Promise.all(DUP_FIELDS.map((f) => checkDuplicate(f, values)));
      const firstDup = DUP_FIELDS.find((_, i) => results[i]);
      if (firstDup) return failOn(firstDup, t(DUP_MESSAGE_KEYS[firstDup]), setFieldError);

      const { join_as, confirm_password, consent_terms, ...rest } = values;
      const result = await memberService.registerMember({
        ...rest,
        role_id: roleIdFromJoinAsText(join_as),
        designation: join_as,
        phone_number: cleanValue('phone_number', values),
        aadhaar_number: cleanValue('aadhaar_number', values),
        voter_id: cleanValue('voter_id', values),
        email: cleanValue('email', values),
      });
      setRegisteredMember(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = errorMessage(err, t('joinPage.submitFailed'));
      const field = axios.isAxiosError(err) ? (err.response?.data as any)?.error?.details?.field : undefined;
      if (field) failOn(field, msg, setFieldError);
      else setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadIdCard = async () => {
    if (!editingMember) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      const token = editingMember.id_card_token || editingMember.verification_token;
      const url = token
        ? `/members/id-card/download?token=${encodeURIComponent(token)}`
        : `/members/${encodeURIComponent(editingMember.member_id)}/id-card`;
      await downloadFile(url, `${editingMember.member_id}_ID_Card.pdf`);
    } catch (err: any) {
      setDownloadError(errorMessage(err, t('profilePage.downloadFailed')));
    } finally {
      setDownloading(false);
    }
  };

  if (registeredMember) {
    return (
      <section className="page-body">
        <div className="container">
          <RegistrationSuccess member={registeredMember} onLogin={() => navigate('/login')} />
        </div>
      </section>
    );
  }

  if (editingMember) {
    return (
      <>
        <PageHero
          eyebrow={t('joinPage.eyebrow')}
          title={t('joinPage.editingTitle')}
          subtitle={t('joinPage.editingSubtitle')}
        />
        <section className="page-body">
          <div className="container">
            <div className="row g-4">
              {/* Left Column: ID Card Preview & Download */}
              <div className="col-lg-5">
                <div className="position-sticky" style={{ top: 'calc(var(--header-h, 80px) + 16px)' }}>
                  <DigitalIdCard
                    fullName={editingMember.full_name}
                    memberId={editingMember.member_id}
                    designation={formatIdCardDesignation(editingMember)}
                    validUntil={formatIdCardExpiry(editingMember.created_at)}
                    bloodGroup={editingMember.blood_group}
                    profileImage={editingMember.profile_image}
                    qrDataUrl={editingMember.qr_data_url}
                  />

                  {downloadError && (
                    <div className="alert alert-danger small mt-3 mb-0" role="alert">
                      {downloadError}
                    </div>
                  )}

                  <div className="d-grid mt-3">
                    <button
                      type="button"
                      className="btn btn-maroon btn-lg d-flex align-items-center justify-content-center gap-2"
                      onClick={handleDownloadIdCard}
                      disabled={downloading}
                    >
                      {downloading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          <span>{t('common.downloading') || 'Downloading...'}</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-file-earmark-pdf fs-5"></i>
                          <span>{t('profilePage.downloadIdCard') || 'Download ID Card (PDF)'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="small text-muted mt-2 mb-0 text-center">
                    <i className="bi bi-qr-code me-1"></i>
                    {t('profilePage.qrNote')}
                  </p>
                </div>
              </div>

              {/* Right Column: Member Profile Edit Form */}
              <div className="col-lg-7">
                <div className="card-custom p-4 p-md-5">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-maroon fs-6 px-3 py-2">{editingMember.member_id}</span>
                        <h2 className="h4 mb-0 text-dark">{editingMember.full_name}</h2>
                      </div>
                      <p className="text-muted small mb-0 mt-1">
                        <i className="bi bi-telephone me-1"></i>+91 {editingMember.phone_number} &bull; <i className="bi bi-geo-alt me-1"></i>{editingMember.district_name || ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setEditingMember(null)}
                    >
                      <i className="bi bi-arrow-left me-1"></i>
                      {t('joinPage.backToRegister')}
                    </button>
                  </div>

                  <MemberProfileEditForm
                    profile={profileForEdit}
                    onSaved={(updated) => {
                      setEditingMember(null);
                      setRegisteredMember({
                        ...editingMember,
                        ...updated,
                        qr_data_url: updated.qr_data_url || editingMember.qr_data_url,
                        id_card_token: updated.id_card_token || editingMember.id_card_token,
                      });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onCancel={() => setEditingMember(null)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow={t('joinPage.eyebrow')} title={t('common.joinMovement')} subtitle={t('joinPage.subtitle')} />
      <section className="page-body">
        <div className="container">
          <div className="card-custom p-4 p-md-5">
            {/* Banner for already registered members needing to edit */}
            <div
              className="d-flex flex-wrap align-items-center justify-content-between p-3 mb-4 rounded-3"
              style={{ background: '#fff9eb', border: '1px solid #ffd591' }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white"
                  style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #b8860b, #d4af37)', flexShrink: 0 }}
                >
                  <i className="bi bi-person-gear fs-5"></i>
                </div>
                <div>
                  <span className="fw-semibold text-dark d-block">{t('joinPage.alreadyRegisteredEdit')}</span>
                  <span className="text-muted small">{t('joinPage.editPromptSubtitle')}</span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-maroon btn-sm px-3 py-2 mt-2 mt-sm-0"
                onClick={() => {
                  setLookupPhone('');
                  setLookupError(null);
                  setShowLookupModal(true);
                }}
              >
                <i className="bi bi-pencil-square me-1"></i>
                {t('joinPage.clickToEdit')}
              </button>
            </div>

            {submitError && (
              <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <div>{submitError}</div>
              </div>
            )}
            <Formik initialValues={initialValues} validationSchema={schema} onSubmit={handleSubmit} validateOnBlur validateOnChange>
              {({ isSubmitting }) => (
                <Form noValidate>
                  <PersonalInformationForm duplicates={duplicates} />
                  <hr className="my-4" />
                  <IdentityLocationForm duplicates={duplicates} isSubmitting={isSubmitting} />
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </section>

      {/* Phone verification modal for member edit */}
      {showLookupModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', zIndex: 1060 }}
          onClick={() => { if (!lookupLoading) setShowLookupModal(false); }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: 480 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
                <div>
                  <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                    <i className="bi bi-person-lines-fill text-maroon fs-4"></i>
                    {t('joinPage.editPromptTitle')}
                  </h5>
                  <p className="text-muted small mb-0 mt-1">
                    {t('joinPage.editPromptSubtitle')}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  disabled={lookupLoading}
                  onClick={() => setShowLookupModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleLookupSubmit}>
                <div className="modal-body px-4 py-3">
                  {lookupError && (
                    <div className="alert alert-danger small d-flex align-items-center gap-2 mb-3" role="alert">
                      <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
                      <div>{lookupError}</div>
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="lookupPhone" className="form-label small fw-semibold text-secondary">
                      {t('joinPage.phoneLabel')} <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light fw-medium text-dark">+91</span>
                      <input
                        id="lookupPhone"
                        type="tel"
                        className="form-control form-control-lg fs-6"
                        placeholder={t('joinPage.phonePlaceholder')}
                        value={lookupPhone}
                        onChange={(e) => {
                          setLookupPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                          setLookupError(null);
                        }}
                        maxLength={10}
                        autoFocus
                        required
                      />
                    </div>
                    <div className="form-text small">
                      {lookupPhone.length}/10 digits
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top-0 pt-0 pb-4 px-4 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-3"
                    disabled={lookupLoading}
                    onClick={() => setShowLookupModal(false)}
                  >
                    {t('common.cancel') || 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-maroon px-4"
                    disabled={lookupLoading || lookupPhone.trim().length !== 10}
                  >
                    {lookupLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {t('joinPage.verifying')}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle me-1"></i>
                        {t('joinPage.verifyAndEdit')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
