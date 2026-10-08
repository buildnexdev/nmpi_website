import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, FormikTouched } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { Language, translate, useLanguage } from '../context/LanguageContext';
import { memberService, RegisterMemberPayload, RegisteredMember } from '../services/memberService';
import { errorMessage } from '../services/apiClient';
import { PageHero } from '../components/ui';
import { PersonalInformationForm } from '../components/join/PersonalInformationForm';
import { IdentityLocationForm } from '../components/join/IdentityLocationForm';
import { RegistrationSuccess } from '../components/join/RegistrationSuccess';
import { DuplicateChecker, DuplicateField } from '../components/join/duplicateCheck';

type JoinValues = RegisterMemberPayload & { confirm_password: string; consent_terms: boolean };

const ALL_FIELDS = [
  'full_name', 'father_name', 'date_of_birth', 'gender', 'country_code', 'phone_number', 'email',
  'password', 'confirm_password', 'blood_group', 'profile_image',
  'aadhaar_number', 'voter_id', 'parliament_constituency_id', 'district_id', 'block_id', 'role_id', 'consent_terms',
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
    role_id: selectRequired('roleRequired'),
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
  role_id: '1',
  consent_terms: false,
};

export const JoinPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registeredMember, setRegisteredMember] = useState<RegisteredMember | null>(null);
  const schema = useMemo(() => buildSchema(lang), [lang]);

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

  const handleSubmit = async (values: JoinValues, { setSubmitting, setFieldError, setTouched }: any) => {
    setSubmitError(null);
    setTouched(Object.fromEntries(ALL_FIELDS.map((f) => [f, true])) as FormikTouched<JoinValues>);
    try {
      const results = await Promise.all(DUP_FIELDS.map((f) => checkDuplicate(f, values)));
      const firstDup = DUP_FIELDS.find((_, i) => results[i]);
      if (firstDup) return failOn(firstDup, t(DUP_MESSAGE_KEYS[firstDup]), setFieldError);

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
          <RegistrationSuccess member={registeredMember} onLogin={() => navigate('/login')} />
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHero eyebrow={t('joinPage.eyebrow')} title={t('common.joinMovement')} subtitle={t('joinPage.subtitle')} />
      <section className="page-body">
        <div className="container">
          <div className="card-custom p-4 p-md-5">
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
    </>
  );
};
