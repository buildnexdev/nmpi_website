import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, FormikErrors, FormikTouched } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { Language, translate, useLanguage } from '../context/LanguageContext';
import { memberService, RegisterMemberPayload, RegisteredMember } from '../services/memberService';
import { errorMessage } from '../services/apiClient';
import { PageHero } from '../components/ui';
import { RegistrationProgress } from '../components/join/RegistrationProgress';
import { PersonalInformationForm } from '../components/join/PersonalInformationForm';
import { IdentityLocationForm } from '../components/join/IdentityLocationForm';
import { RegistrationSuccess } from '../components/join/RegistrationSuccess';
import { DuplicateChecker, DuplicateField } from '../components/join/duplicateCheck';

type JoinValues = RegisterMemberPayload & { confirm_password: string; consent_terms: boolean };

const TAB1_FIELDS = ['full_name', 'father_name', 'date_of_birth', 'gender', 'country_code', 'phone_number', 'email', 'password', 'confirm_password', 'blood_group', 'profile_image'];
const TAB1_DUP_FIELDS: DuplicateField[] = ['phone_number', 'email'];
const TAB2_DUP_FIELDS: DuplicateField[] = ['aadhaar_number', 'voter_id'];

/** Normalise a field exactly the way the backend does before it is compared / stored. */
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

/** Only hit the server once the value is complete enough to be a real candidate. */
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

const buildSchemas = (lang: Language) => {
  const msg = (key: string) => translate(lang, `joinForm.validation.${key}`);
  const tab1 = yup.object({
    full_name: yup.string().trim().min(2, msg('fullNameMin')).required(msg('fullNameRequired')),
    father_name: yup.string().trim().required(msg('fatherNameRequired')),
    date_of_birth: yup
      .string()
      .required(msg('dobRequired'))
      .test('adult', msg('dobAdult'), isAdult),
    gender: yup.string().oneOf(['MALE', 'FEMALE', 'OTHER']).required(),
    country_code: yup.string().required(),
    phone_number: yup
      .string()
      .transform((v) => (v ? v.replace(/\D/g, '') : v))
      .matches(/^\d{10}$/, msg('phoneInvalid'))
      .required(msg('phoneRequired')),
    email: yup.string().trim().email(msg('emailInvalid')).required(msg('emailRequired')),
    password: yup.string().min(8, msg('passwordMin')).required(msg('passwordRequired')),
    confirm_password: yup
      .string()
      .oneOf([yup.ref('password')], msg('passwordMismatch'))
      .required(msg('confirmPasswordRequired')),
  });
  const selectRequired = (key: string) =>
    yup.number().transform((v, orig) => (orig === '' ? undefined : v)).typeError(msg(key)).positive(msg(key)).required(msg(key));
  const tab2 = yup.object({
    aadhaar_number: yup
      .string()
      .transform((v) => (v ? String(v).replace(/\D/g, '') : ''))
      .test('aadhaar-12', msg('aadhaarInvalid'), (v) => /^\d{12}$/.test(v || ''))
      .required(msg('aadhaarRequired')),
    voter_id: yup
      .string()
      .transform((v) => (v ? String(v).replace(/[^A-Za-z0-9]/g, '').toUpperCase() : ''))
      .min(6, msg('voterIdMin'))
      .required(msg('voterIdRequired')),
    parliament_constituency_id: selectRequired('parliamentRequired'),
    district_id: selectRequired('districtRequired'),
    block_id: selectRequired('blockRequired'),
    consent_terms: yup.boolean().oneOf([true], msg('consentRequired')),
  });
  return { tab1, tab2 };
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
  role_id: '1',
  consent_terms: false,
};

export const JoinPage: React.FC = () => {
  const { lang, t, tRaw } = useLanguage();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registeredMember, setRegisteredMember] = useState<RegisteredMember | null>(null);
  const { tab1, tab2 } = useMemo(() => buildSchemas(lang), [lang]);

  // ---- Live duplicate checks (phone / email / Aadhaar / Voter ID) ----
  const [dupErrors, setDupErrors] = useState<Partial<Record<DuplicateField, string>>>({});
  const [dupChecking, setDupChecking] = useState<Partial<Record<DuplicateField, boolean>>>({});
  // Remembers the last value that was checked per field so we don't re-query the same value.
  const lastChecked = useRef<Partial<Record<DuplicateField, { value: string; exists: boolean }>>>({});

  const clearDuplicate = useCallback((field: DuplicateField) => {
    setDupErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  /** Returns true when the value is already registered. Network failures resolve to false (the server re-checks on submit). */
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

  const goToTab = (tab: number) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = async (values: JoinValues, validateForm: () => Promise<FormikErrors<JoinValues>>, setTouched: (t: FormikTouched<JoinValues>) => void) => {
    setTouched(Object.fromEntries(TAB1_FIELDS.map((f) => [f, true])) as FormikTouched<JoinValues>);
    const errors = await validateForm();
    if (Object.keys(errors).length > 0) return;
    const results = await Promise.all(TAB1_DUP_FIELDS.map((f) => checkDuplicate(f, values)));
    if (results.some(Boolean)) return;
    setSubmitError(null);
    goToTab(2);
  };

  const failOn = (field: string, message: string, setFieldError: (f: string, m: string) => void) => {
    setSubmitError(message);
    setFieldError(field, message);
    if (field in DUP_MESSAGE_KEYS) setDupErrors((prev) => ({ ...prev, [field]: message }));
    if (TAB1_FIELDS.includes(field)) goToTab(1);
  };

  const handleSubmit = async (values: JoinValues, { setSubmitting, setFieldError, setTouched }: any) => {
    setSubmitError(null);
    if (currentTab === 1) {
      setTouched({}, false);
      setSubmitting(false);
      return goToTab(2);
    }
    try {
      // Re-run every duplicate check right before submitting (values may have changed since the blur checks)
      const allDup: DuplicateField[] = [...TAB1_DUP_FIELDS, ...TAB2_DUP_FIELDS];
      const results = await Promise.all(allDup.map((f) => checkDuplicate(f, values)));
      const firstDup = allDup.find((_, i) => results[i]);
      if (firstDup) {
        return failOn(firstDup, t(DUP_MESSAGE_KEYS[firstDup]), setFieldError);
      }
      const result = await memberService.registerMember({
        ...values,
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

  if (registeredMember) {
    return (
      <section className="page-body">
        <div className="container">
          <RegistrationProgress currentTab={3} />
          <RegistrationSuccess member={registeredMember} onLogin={() => navigate('/login')} />
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={t('joinPage.eyebrow')}
        title={t('common.joinMovement')}
        subtitle={t('joinPage.subtitle')}
      />
      <section className="page-body">
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="col-lg-8">
              <div className="card-custom p-4 p-md-5">
                <RegistrationProgress currentTab={currentTab} />
                {submitError && (
                  <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <div>{submitError}</div>
                  </div>
                )}
                <Formik initialValues={initialValues} validationSchema={currentTab === 1 ? tab1 : tab2} onSubmit={handleSubmit}>
                  {({ values, validateForm, setTouched, isSubmitting }) => (
                    <Form noValidate>
                      {currentTab === 1 ? (
                        <PersonalInformationForm duplicates={duplicates} onNext={() => handleNext(values, validateForm, setTouched)} />
                      ) : (
                        <IdentityLocationForm duplicates={duplicates} onBack={() => goToTab(1)} isSubmitting={isSubmitting} />
                      )}
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card-custom p-4 mb-4">
                <h2 className="h6 mb-3">{t('joinPage.whatYouGet')}</h2>
                <ul className="check-list mb-0 small">
                  {(tRaw<string[]>('joinPage.benefits') ?? []).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div className="card-custom p-4">
                <h2 className="h6 mb-2">{t('joinPage.keepReady')}</h2>
                <p className="small text-muted mb-2">{t('joinPage.keepReadyText')}</p>
                <p className="small mb-0">
                  {t('joinPage.alreadyMember')} <Link to="/login" className="fw-semibold">{t('joinPage.logIn')}</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
