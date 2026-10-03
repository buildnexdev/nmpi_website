import React, { useEffect, useState } from 'react';
import { Field, ErrorMessage, useFormikContext } from 'formik';

interface PersonalInformationFormProps {
  lang?: string;
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

export const PersonalInformationForm: React.FC<PersonalInformationFormProps> = ({ lang = 'en', onNext }) => {
  const ta = lang === 'ta';
  const { values, setFieldValue, errors, touched } = useFormikContext<any>();
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (!(values.profile_image instanceof File)) return setImagePreview(null);
    const url = URL.createObjectURL(values.profile_image);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [values.profile_image]);

  const invalid = (name: string) => (touched[name] && errors[name] ? 'is-invalid' : '');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      return setImageError(ta ? 'JPG, PNG அல்லது WEBP படத்தைத் தேர்ந்தெடுக்கவும்.' : 'Please choose a JPG, PNG or WEBP image.');
    }
    if (file.size > 5 * 1024 * 1024) {
      return setImageError(ta ? 'படம் 5MB-க்கு குறைவாக இருக்க வேண்டும்.' : 'The image must be smaller than 5 MB.');
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
          <div className="fw-semibold">{ta ? 'சுயவிவரப் படம்' : 'Profile photo'} <span className="text-muted fw-normal small">({ta ? 'விருப்பம்' : 'optional'})</span></div>
          <div className="small text-muted mb-2">{ta ? 'உங்கள் அடையாள அட்டையில் அச்சிடப்படும். JPG/PNG/WEBP, அதிகபட்சம் 5MB.' : 'Printed on your ID card. JPG, PNG or WEBP, up to 5 MB.'}</div>
          <div className="d-flex gap-2">
            <label className="btn btn-sm btn-outline-maroon mb-0">
              <i className="bi bi-upload me-1"></i>{imagePreview ? (ta ? 'மாற்று' : 'Change') : (ta ? 'பதிவேற்று' : 'Upload')}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="d-none" onChange={handleImageChange} />
            </label>
            {imagePreview && (
              <button type="button" className="btn btn-sm btn-link text-danger" onClick={() => setFieldValue('profile_image', null)}>
                {ta ? 'நீக்கு' : 'Remove'}
              </button>
            )}
          </div>
          {imageError && <div className="text-danger small mt-1">{imageError}</div>}
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="full_name" className="form-label small fw-semibold">{ta ? 'முழு பெயர்' : 'Full name'} *</label>
          <Field id="full_name" name="full_name" autoComplete="name" className={`form-control ${invalid('full_name')}`} />
          <ErrorMessage name="full_name" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-6">
          <label htmlFor="father_name" className="form-label small fw-semibold">{ta ? 'தந்தை / கணவர் பெயர்' : "Father's / husband's name"} *</label>
          <Field id="father_name" name="father_name" className={`form-control ${invalid('father_name')}`} />
          <ErrorMessage name="father_name" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-6">
          <label htmlFor="date_of_birth" className="form-label small fw-semibold">{ta ? 'பிறந்த தேதி' : 'Date of birth'} *</label>
          <Field id="date_of_birth" name="date_of_birth" type="date" max={maxDob} className={`form-control ${invalid('date_of_birth')}`} />
          <ErrorMessage name="date_of_birth" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-6">
          <span className="form-label small fw-semibold d-block">{ta ? 'பாலினம்' : 'Gender'} *</span>
          <div className="btn-group w-100" role="radiogroup" aria-label={ta ? 'பாலினம்' : 'Gender'}>
            {[
              ['MALE', ta ? 'ஆண்' : 'Male'],
              ['FEMALE', ta ? 'பெண்' : 'Female'],
              ['OTHER', ta ? 'இதர' : 'Other'],
            ].map(([value, label]) => (
              <React.Fragment key={value}>
                <Field type="radio" className="btn-check" name="gender" id={`gender-${value}`} value={value} />
                <label className="btn btn-outline-maroon" htmlFor={`gender-${value}`}>{label}</label>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <label htmlFor="phone_number" className="form-label small fw-semibold">{ta ? 'கைபேசி எண்' : 'Mobile number'} *</label>
          <div className="input-group has-validation">
            <Field as="select" name="country_code" className="form-select flex-grow-0" style={{ width: 110 }} aria-label={ta ? 'நாட்டுக் குறியீடு' : 'Country code'}>
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </Field>
            <Field id="phone_number" name="phone_number" inputMode="numeric" autoComplete="tel-national" maxLength={10} className={`form-control ${invalid('phone_number')}`} />
            <ErrorMessage name="phone_number" component="div" className="invalid-feedback" />
          </div>
        </div>
        <div className="col-md-6">
          <label htmlFor="email" className="form-label small fw-semibold">{ta ? 'மின்னஞ்சல்' : 'Email address'} *</label>
          <Field id="email" name="email" type="email" autoComplete="email" className={`form-control ${invalid('email')}`} />
          <ErrorMessage name="email" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-6">
          <label htmlFor="password" className="form-label small fw-semibold">{ta ? 'கடவுச்சொல் உருவாக்கவும்' : 'Create password'} *</label>
          <div className="input-group has-validation">
            <Field id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" className={`form-control ${invalid('password')}`} placeholder={ta ? 'குறைந்தது 8 எழுத்துகள்' : 'At least 8 characters'} />
            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </button>
            <ErrorMessage name="password" component="div" className="invalid-feedback" />
          </div>
        </div>
        <div className="col-md-6">
          <label htmlFor="confirm_password" className="form-label small fw-semibold">{ta ? 'கடவுச்சொல்லை உறுதிசெய்' : 'Confirm password'} *</label>
          <Field id="confirm_password" name="confirm_password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" className={`form-control ${invalid('confirm_password')}`} />
          <ErrorMessage name="confirm_password" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-6">
          <label htmlFor="blood_group" className="form-label small fw-semibold">{ta ? 'இரத்த வகை' : 'Blood group'}</label>
          <Field as="select" id="blood_group" name="blood_group" className="form-select">
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>{bg === 'Unknown' ? (ta ? 'தெரியவில்லை' : 'Not sure') : bg}</option>
            ))}
          </Field>
        </div>
      </div>

      <div className="mt-4 pt-3 border-top d-flex justify-content-end">
        <button type="button" className="btn btn-maroon px-4" onClick={onNext}>
          {ta ? 'அடுத்து' : 'Continue'} <i className="bi bi-arrow-right ms-1"></i>
        </button>
      </div>
    </div>
  );
};
