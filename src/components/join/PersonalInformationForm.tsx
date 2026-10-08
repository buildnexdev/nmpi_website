import React, { useEffect, useState } from 'react';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import { DuplicateChecker } from './duplicateCheck';
import { useLanguage } from '../../context/LanguageContext';

interface PersonalInformationFormProps {
  duplicates: DuplicateChecker;
  onNext: () => void;
}

const countryCodes = [
  { code: '+91', label: 'IN +91' },
  { code: '+971', label: 'AE +971' },
  { code: '+65', label: 'SG +65' },
  { code: '+60', label: 'MY +60' },
  { code: '+44', label: 'UK +44' },
  { code: '+1', label: 'US +1' },
  { code: '+61', label: 'AU +61' },
];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'];

export const PersonalInformationForm: React.FC<PersonalInformationFormProps> = ({ duplicates, onNext }) => {
  const { t } = useLanguage();
  const { values, setFieldValue, setFieldTouched, errors, touched } = useFormikContext<any>();
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (!(values.profile_image instanceof File)) return setImagePreview(null);
    const url = URL.createObjectURL(values.profile_image);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [values.profile_image]);

  const invalid = (name: string) => (touched[name] && errors[name]) || (duplicates.errors as any)[name] ? 'is-invalid' : '';
  const dupFeedback = (name: 'phone_number' | 'email') =>
    duplicates.errors[name] && !(touched[name] && errors[name]) ? <div className="invalid-feedback d-block">{duplicates.errors[name]}</div> : null;
  const checkingIcon = (name: 'phone_number' | 'email') =>
    duplicates.checking[name] ? <span className="spinner-border spinner-border-sm text-maroon ms-2 align-middle" aria-hidden="true"></span> : null;

  // Mobile: digits only, max 10 (spaces, dashes, "+" are stripped as the user types)
  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue('phone_number', e.target.value.replace(/\D/g, '').slice(0, 10));
    duplicates.clear('phone_number');
  };
  const onPhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFieldValue('phone_number', digits, true);
    setFieldTouched('phone_number', true);
    duplicates.check('phone_number', { ...values, phone_number: digits });
  };
  const onCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFieldValue('country_code', e.target.value);
    duplicates.clear('phone_number');
  };

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue('email', e.target.value.replace(/\s+/g, ''));
    duplicates.clear('email');
  };
  const onEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value.replace(/\s+/g, '').trim().toLowerCase();
    setFieldValue('email', email, true);
    setFieldTouched('email', true);
    duplicates.check('email', { ...values, email });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      return setImageError(t('joinForm.imageTypeError'));
    }
    if (file.size > 5 * 1024 * 1024) {
      return setImageError(t('joinForm.imageSizeError'));
    }
    setFieldValue('profile_image', file);
  };

  const maxDob = new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().slice(0, 10);

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded-3" style={{ background: 'var(--color-bg)' }}>
        <div className="position-relative flex-shrink-0">
          {imagePreview ? (
            <img src={imagePreview} alt="" className="rounded-circle" style={{ width: 76, height: 76, objectFit: 'cover', border: '3px solid var(--accent-gold)' }} />
          ) : (
            <div className="rounded-circle d-flex align-items-center justify-content-center bg-white border" style={{ width: 76, height: 76 }}>
              <i className="bi bi-person fs-2 text-muted"></i>
            </div>
          )}
        </div>
        <div className="flex-grow-1">
          <div className="fw-semibold">{t('joinForm.profilePhoto')} <span className="text-muted fw-normal small">({t('joinForm.optional')})</span></div>
          <div className="small text-muted mb-2">{t('joinForm.profilePhotoHint')}</div>
          <div className="d-flex gap-2">
            <label className="btn btn-sm btn-outline-maroon mb-0">
              <i className="bi bi-upload me-1"></i>{imagePreview ? t('joinForm.change') : t('joinForm.upload')}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="d-none" onChange={handleImageChange} />
            </label>
            {imagePreview && (
              <button type="button" className="btn btn-sm btn-link text-danger" onClick={() => setFieldValue('profile_image', null)}>
                {t('joinForm.remove')}
              </button>
            )}
          </div>
          {imageError && <div className="text-danger small mt-1">{imageError}</div>}
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="full_name" className="form-label small fw-semibold">{t('joinForm.fullName')} *</label>
          <Field id="full_name" name="full_name" autoComplete="name" className={`form-control ${invalid('full_name')}`} />
          <ErrorMessage name="full_name" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-6">
          <label htmlFor="father_name" className="form-label small fw-semibold">{t('joinForm.fatherName')} *</label>
          <Field id="father_name" name="father_name" className={`form-control ${invalid('father_name')}`} />
          <ErrorMessage name="father_name" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-6">
          <label htmlFor="date_of_birth" className="form-label small fw-semibold">{t('joinForm.dateOfBirth')} *</label>
          <Field id="date_of_birth" name="date_of_birth" type="date" max={maxDob} className={`form-control ${invalid('date_of_birth')}`} />
          <ErrorMessage name="date_of_birth" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-6">
          <span className="form-label small fw-semibold d-block">{t('joinForm.gender')} *</span>
          <div className="btn-group w-100" role="radiogroup" aria-label={t('joinForm.gender')}>
            {[
              ['MALE', t('joinForm.genderMale')],
              ['FEMALE', t('joinForm.genderFemale')],
              ['OTHER', t('joinForm.genderOther')],
            ].map(([value, label]) => (
              <React.Fragment key={value}>
                <input type="radio" className="btn-check" name="gender" id={`gender-${value}`} value={value} checked={values.gender === value} onChange={() => setFieldValue('gender', value)} />
                <label className="btn btn-outline-maroon" htmlFor={`gender-${value}`}>{label}</label>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <label htmlFor="phone_number" className="form-label small fw-semibold">{t('joinForm.mobileNumber')} *{checkingIcon('phone_number')}</label>
          <div className="input-group has-validation">
            <select name="country_code" value={values.country_code} onChange={onCountryChange} className="form-select flex-grow-0" style={{ width: 110 }} aria-label={t('joinForm.countryCode')}>
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
            <input
              id="phone_number"
              name="phone_number"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="tel-national"
              maxLength={10}
              placeholder={t('joinForm.phonePlaceholder')}
              value={values.phone_number}
              onChange={onPhoneChange}
              onBlur={onPhoneBlur}
              className={`form-control ${invalid('phone_number')}`}
            />
            <ErrorMessage name="phone_number" component="div" className="invalid-feedback" />
            {dupFeedback('phone_number')}
          </div>
        </div>
        <div className="col-md-6">
          <label htmlFor="email" className="form-label small fw-semibold">{t('joinForm.email')} *{checkingIcon('email')}</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={onEmailChange}
            onBlur={onEmailBlur}
            className={`form-control ${invalid('email')}`}
          />
          <ErrorMessage name="email" component="div" className="invalid-feedback" />
          {dupFeedback('email')}
        </div>
        <div className="col-md-6">
          <label htmlFor="password" className="form-label small fw-semibold">{t('joinForm.createPassword')} *</label>
          <div className="input-group has-validation">
            <Field id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" className={`form-control ${invalid('password')}`} placeholder={t('joinForm.passwordPlaceholder')} />
            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? t('joinForm.hidePassword') : t('joinForm.showPassword')}>
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </button>
            <ErrorMessage name="password" component="div" className="invalid-feedback" />
          </div>
        </div>
        <div className="col-md-6">
          <label htmlFor="confirm_password" className="form-label small fw-semibold">{t('joinForm.confirmPassword')} *</label>
          <Field id="confirm_password" name="confirm_password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" className={`form-control ${invalid('confirm_password')}`} />
          <ErrorMessage name="confirm_password" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-6">
          <label htmlFor="blood_group" className="form-label small fw-semibold">{t('joinForm.bloodGroup')}</label>
          <Field as="select" id="blood_group" name="blood_group" className="form-select">
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>{bg === 'Unknown' ? t('joinForm.bloodGroupUnknown') : bg}</option>
            ))}
          </Field>
        </div>
      </div>

      <div className="mt-4 pt-3 border-top d-flex justify-content-end">
        <button type="button" className="btn btn-maroon px-4" onClick={onNext}>
          {t('joinForm.continue')} <i className="bi bi-arrow-right ms-1"></i>
        </button>
      </div>
    </div>
  );
};
