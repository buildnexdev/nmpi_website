import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, FormikErrors, FormikTouched } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { memberService, RegisterMemberPayload } from '../services/memberService';
import { errorMessage } from '../services/apiClient';
import { PageHero } from '../components/ui';
import { RegistrationProgress } from '../components/join/RegistrationProgress';
import { PersonalInformationForm } from '../components/join/PersonalInformationForm';
import { IdentityLocationForm } from '../components/join/IdentityLocationForm';
import { RegistrationSuccess } from '../components/join/RegistrationSuccess';

type JoinValues = RegisterMemberPayload & { confirm_password: string; consent_terms: boolean };

const TAB1_FIELDS = ['full_name', 'father_name', 'date_of_birth', 'gender', 'country_code', 'phone_number', 'email', 'password', 'confirm_password', 'blood_group'];

function isAdult(value?: string) {
  if (!value) return false;
  const dob = new Date(`${value}T00:00:00`);
  if (Number.isNaN(dob.getTime())) return false;
  const adult = new Date(dob);
  adult.setFullYear(dob.getFullYear() + 18);
  return adult <= new Date();
}

const buildSchemas = (ta: boolean) => {
  const req = (en: string, t: string) => (ta ? t : en);
  const tab1 = yup.object({
    full_name: yup.string().trim().min(2, req('Enter your full name', 'முழு பெயரை உள்ளிடவும்')).required(req('Full name is required', 'முழு பெயர் அவசியம்')),
    father_name: yup.string().trim().required(req("Father's / husband's name is required", 'தந்தை / கணவர் பெயர் அவசியம்')),
    date_of_birth: yup
      .string()
      .required(req('Date of birth is required', 'பிறந்த தேதி அவசியம்'))
      .test('adult', req('You must be at least 18 years old to join', 'இணைய குறைந்தது 18 வயது இருக்க வேண்டும்'), isAdult),
    gender: yup.string().oneOf(['MALE', 'FEMALE', 'OTHER']).required(),
    country_code: yup.string().required(),
    phone_number: yup
      .string()
      .transform((v) => (v ? v.replace(/\D/g, '') : v))
      .matches(/^\d{10}$/, req('Enter a 10-digit mobile number', '10 இலக்க கைபேசி எண்ணை உள்ளிடவும்'))
      .required(req('Mobile number is required', 'கைபேசி எண் அவசியம்')),
    email: yup.string().trim().email(req('Enter a valid email address', 'சரியான மின்னஞ்சலை உள்ளிடவும்')).required(req('Email is required', 'மின்னஞ்சல் அவசியம்')),
    password: yup.string().min(8, req('Password must be at least 8 characters', 'கடவுச்சொல் குறைந்தது 8 எழுத்துகள்')).required(req('Password is required', 'கடவுச்சொல் அவசியம்')),
    confirm_password: yup
      .string()
      .oneOf([yup.ref('password')], req('Passwords do not match', 'கடவுச்சொற்கள் பொருந்தவில்லை'))
      .required(req('Please confirm your password', 'கடவுச்சொல்லை உறுதிசெய்யவும்')),
  });
  const selectRequired = (en: string, t: string) =>
    yup.number().transform((v, orig) => (orig === '' ? undefined : v)).typeError(req(en, t)).positive(req(en, t)).required(req(en, t));
  const tab2 = yup.object({
    aadhaar_number: yup
      .string()
      .transform((v) => (v ? v.replace(/\s+/g, '') : ''))
      .matches(/^\d{12}$/, req('Aadhaar number must be 12 digits', 'ஆதார் எண் 12 இலக்கங்கள் இருக்க வேண்டும்'))
      .required(req('Aadhaar number is required', 'ஆதார் எண் அவசியம்')),
    voter_id: yup
      .string()
      .transform((v) => (v ? v.replace(/\s+/g, '').toUpperCase() : ''))
      .min(6, req('Voter ID must be at least 6 characters', 'வாக்காளர் எண் குறைந்தது 6 எழுத்துகள்'))
      .required(req('Voter ID is required', 'வாக்காளர் எண் அவசியம்')),
    parliament_constituency_id: selectRequired('Select your parliament constituency', 'நாடாளுமன்றத் தொகுதியைத் தேர்ந்தெடுக்கவும்'),
    district_id: selectRequired('Select your district', 'மாவட்டத்தைத் தேர்ந்தெடுக்கவும்'),
    block_id: selectRequired('Select your taluk / block', 'தாலுகா / ஒன்றியத்தைத் தேர்ந்தெடுக்கவும்'),
    consent_terms: yup.boolean().oneOf([true], req('Please accept the Privacy Policy and Terms to continue', 'தொடர தனியுரிமைக் கொள்கை மற்றும் விதிமுறைகளை ஏற்கவும்')),
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
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registeredMember, setRegisteredMember] = useState<any | null>(null);
  const { tab1, tab2 } = buildSchemas(ta);

  const goToTab = (tab: number) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = async (validateForm: () => Promise<FormikErrors<JoinValues>>, setTouched: (t: FormikTouched<JoinValues>) => void) => {
    setTouched(Object.fromEntries(TAB1_FIELDS.map((f) => [f, true])) as FormikTouched<JoinValues>);
    const errors = await validateForm();
    if (Object.keys(errors).length === 0) {
      setSubmitError(null);
      goToTab(2);
    }
  };

  const failOn = (field: string, message: string, setFieldError: (f: string, m: string) => void) => {
    setSubmitError(message);
    setFieldError(field, message);
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
      const phone = values.phone_number.replace(/\D/g, '');
      const aadhaar = values.aadhaar_number.replace(/\s+/g, '');
      const voterId = values.voter_id.replace(/\s+/g, '').toUpperCase();
      if ((await memberService.checkPhone(values.country_code, phone)).exists) {
        return failOn('phone_number', ta ? 'இந்தக் கைபேசி எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது.' : 'This mobile number is already registered.', setFieldError);
      }
      if ((await memberService.checkAadhaar(aadhaar)).exists) {
        return failOn('aadhaar_number', ta ? 'இந்த ஆதார் எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது.' : 'This Aadhaar number is already registered.', setFieldError);
      }
      if ((await memberService.checkVoterId(voterId)).exists) {
        return failOn('voter_id', ta ? 'இந்த வாக்காளர் எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது.' : 'This Voter ID is already registered.', setFieldError);
      }
      const result = await memberService.registerMember({ ...values, phone_number: phone, aadhaar_number: aadhaar, voter_id: voterId, email: values.email.trim() });
      setRegisteredMember(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = errorMessage(err, ta ? 'பதிவைச் சமர்ப்பிக்க முடியவில்லை.' : 'Could not submit your registration.');
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
          <RegistrationProgress currentTab={3} lang={lang} />
          <RegistrationSuccess member={registeredMember} lang={lang} onLogin={() => navigate('/login')} />
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={ta ? 'உறுப்பினர் சேர்க்கை' : 'Membership'}
        title={ta ? 'இயக்கத்தில் இணையுங்கள்' : 'Join the movement'}
        subtitle={ta ? 'இலவசப் பதிவு — இரண்டு எளிய படிகளில் உங்கள் QR சரிபார்ப்பு டிஜிட்டல் அடையாள அட்டையைப் பெறுங்கள்.' : 'Free registration — get your QR-verified digital ID card in two simple steps.'}
      />
      <section className="page-body">
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="col-lg-8">
              <div className="card-custom p-4 p-md-5">
                <RegistrationProgress currentTab={currentTab} lang={lang} />
                {submitError && (
                  <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <div>{submitError}</div>
                  </div>
                )}
                <Formik initialValues={initialValues} validationSchema={currentTab === 1 ? tab1 : tab2} onSubmit={handleSubmit}>
                  {({ validateForm, setTouched, isSubmitting }) => (
                    <Form noValidate>
                      {currentTab === 1 ? (
                        <PersonalInformationForm lang={lang} onNext={() => handleNext(validateForm, setTouched)} />
                      ) : (
                        <IdentityLocationForm lang={lang} onBack={() => goToTab(1)} isSubmitting={isSubmitting} />
                      )}
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card-custom p-4 mb-4">
                <h2 className="h6 mb-3">{ta ? 'நீங்கள் பெறுவது' : 'What you get'}</h2>
                <ul className="check-list mb-0 small">
                  <li>{ta ? 'தனித்துவமான உறுப்பினர் எண்' : 'A unique member ID'}</li>
                  <li>{ta ? 'QR சரிபார்ப்புடன் டிஜிட்டல் அடையாள அட்டை' : 'Digital ID card with QR verification'}</li>
                  <li>{ta ? 'நிகழ்வுகள் மற்றும் செய்திகள் பற்றிய தகவல்' : 'Updates on events and news'}</li>
                  <li>{ta ? 'மாவட்ட நிர்வாகிகளுடன் தொடர்பு' : 'A direct line to district leaders'}</li>
                </ul>
              </div>
              <div className="card-custom p-4">
                <h2 className="h6 mb-2">{ta ? 'தேவையான ஆவணங்கள்' : 'Keep these ready'}</h2>
                <p className="small text-muted mb-2">{ta ? 'ஆதார் எண், வாக்காளர் அடையாள எண், மற்றும் விருப்பமாக ஒரு புகைப்படம்.' : 'Your Aadhaar number, Voter ID number and, optionally, a photo.'}</p>
                <p className="small mb-0">
                  {ta ? 'ஏற்கனவே உறுப்பினரா?' : 'Already a member?'} <Link to="/login" className="fw-semibold">{ta ? 'உள்நுழைக' : 'Log in'}</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
