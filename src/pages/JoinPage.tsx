import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { apiClient } from '../services/apiClient';
import './JoinPage.css';

const step1Schema = yup.object().shape({
  full_name: yup.string().required('Full Name is required'),
  father_name: yup.string().required("Father's Name is required"),
  date_of_birth: yup.string().required('Date of Birth is required'),
  gender: yup.string().oneOf(['MALE', 'FEMALE', 'OTHER']).required('Gender is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  mobile: yup.string().required('Mobile number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const step2Schema = yup.object().shape({
  address_line1: yup.string().required('Address Line 1 is required'),
  village: yup.string().required('Village / Town is required'),
  taluk_id: yup.number().positive('Taluk selection required').required('Taluk is required'),
  district_id: yup.number().positive('District selection required').required('District is required'),
  state: yup.string().required('State is required'),
  pincode: yup.string().required('Pincode is required'),
});

const step3Schema = yup.object().shape({
  membership_type_id: yup.number().positive().required('Membership Tier selection required'),
  unit_id: yup.number().positive().required('Local Unit selection required'),
});

const step4Schema = yup.object().shape({
  consent_terms: yup.boolean().oneOf([true], 'You must accept the terms and privacy policy'),
});

export const JoinPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [districts, setDistricts] = useState<any[]>([]);
  const [taluks, setTaluks] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [membershipTypes, setMembershipTypes] = useState<any[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    father_name: '',
    date_of_birth: '',
    gender: 'MALE',
    email: '',
    mobile: '',
    password: '',
    profile_photo: '',
    address_line1: '',
    address_line2: '',
    village: '',
    district_id: 1,
    taluk_id: 1,
    state: 'State Province',
    pincode: '',
    membership_type_id: 1,
    unit_id: 1,
    consent_terms: false,
  });

  useEffect(() => {
    apiClient.get('/geography').then(res => {
      setDistricts(res.data.data.districts || []);
      setTaluks(res.data.data.taluks || []);
      setUnits(res.data.data.units || []);
      setMembershipTypes(res.data.data.membership_types || []);
    }).catch(() => {});
  }, []);

  const handleNext = (values: any) => {
    setFormData(prev => ({ ...prev, ...values }));
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmitFinal = async (values: any) => {
    const finalPayload = { ...formData, ...values };
    setSubmitError(null);
    try {
      await apiClient.post('/auth/register', finalPayload);
      setIsSuccess(true);
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to submit application. Please check your entries.');
    }
  };

  if (isSuccess) {
    return (
      <div className="container py-5">
        <div className="card-custom text-center p-5 mx-auto" style={{ maxWidth: 560 }}>
          <div className="bg-success text-white rounded-circle p-3 d-inline-flex mb-3">
            <i className="bi bi-check-circle-fill fs-1"></i>
          </div>
          <h2 className="text-maroon fw-bold mb-2">Application Submitted!</h2>
          <p className="text-muted mb-4">
            Your membership application has been submitted and registered under status <strong>PENDING REVIEW</strong>. Upon approval by your regional unit administrator, your official Member ID and QR digital card will be activated.
          </p>
          <button className="btn btn-maroon px-4" onClick={() => navigate('/login')}>
            Proceed to Member Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="text-maroon fw-bold h2">Membership Application Wizard</h1>
        <p className="text-muted small">Complete the 4-step verified onboarding form below</p>
      </div>

      {/* Step Indicators */}
      <div className="wizard-step-header max-w-2xl mx-auto" style={{ maxWidth: 640 }}>
        <div className={`wizard-step-item ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}>
          <div className="wizard-step-number">1</div>
          <small className="fw-semibold">Personal</small>
        </div>
        <div className={`wizard-step-item ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}>
          <div className="wizard-step-number">2</div>
          <small className="fw-semibold">Address</small>
        </div>
        <div className={`wizard-step-item ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`}>
          <div className="wizard-step-number">3</div>
          <small className="fw-semibold">Organization</small>
        </div>
        <div className={`wizard-step-item ${currentStep === 4 ? 'active' : ''}`}>
          <div className="wizard-step-number">4</div>
          <small className="fw-semibold">Consent</small>
        </div>
      </div>

      <div className="card-custom p-4 p-md-5 mx-auto" style={{ maxWidth: 680 }}>
        {submitError && <div className="alert alert-danger mb-4">{submitError}</div>}

        {/* STEP 1 */}
        {currentStep === 1 && (
          <Formik initialValues={formData} validationSchema={step1Schema} onSubmit={handleNext}>
            <Form className="row g-3">
              <h5 className="text-maroon fw-bold border-bottom pb-2 mb-3">Step 1: Basic Personal Details</h5>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Full Name *</label>
                <Field name="full_name" className="form-control" placeholder="e.g. John Doe" />
                <ErrorMessage name="full_name" component="div" className="text-danger small" />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Father's / Parent's Name *</label>
                <Field name="father_name" className="form-control" placeholder="e.g. Robert Doe" />
                <ErrorMessage name="father_name" component="div" className="text-danger small" />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Date of Birth *</label>
                <Field name="date_of_birth" type="date" className="form-control" />
                <ErrorMessage name="date_of_birth" component="div" className="text-danger small" />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Gender *</label>
                <Field as="select" name="gender" className="form-select">
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </Field>
                <ErrorMessage name="gender" component="div" className="text-danger small" />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Email Address *</label>
                <Field name="email" type="email" className="form-control" placeholder="name@example.com" />
                <ErrorMessage name="email" component="div" className="text-danger small" />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Mobile Phone Number *</label>
                <Field name="mobile" className="form-control" placeholder="+1 555-0199" />
                <ErrorMessage name="mobile" component="div" className="text-danger small" />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Create Password *</label>
                <Field name="password" type="password" className="form-control" placeholder="At least 6 characters" />
                <ErrorMessage name="password" component="div" className="text-danger small" />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Profile Photo URL (Optional)</label>
                <Field name="profile_photo" className="form-control" placeholder="https://..." />
              </div>

              <div className="col-12 mt-4 d-flex justify-content-end">
                <button type="submit" className="btn btn-maroon px-4">Continue to Address <i className="bi bi-arrow-right ms-1"></i></button>
              </div>
            </Form>
          </Formik>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <Formik initialValues={formData} validationSchema={step2Schema} onSubmit={handleNext}>
            <Form className="row g-3">
              <h5 className="text-maroon fw-bold border-bottom pb-2 mb-3">Step 2: Address & Regional Jurisdiction</h5>
              
              <div className="col-12">
                <label className="form-label small fw-semibold">Address Line 1 (Door / House No. & Street) *</label>
                <Field name="address_line1" className="form-control" placeholder="e.g. 100 Civic Lane" />
                <ErrorMessage name="address_line1" component="div" className="text-danger small" />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Village / Town *</label>
                <Field name="village" className="form-control" placeholder="e.g. Green Park Village" />
                <ErrorMessage name="village" component="div" className="text-danger small" />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">District *</label>
                <Field as="select" name="district_id" className="form-select">
                  {districts.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="district_id" component="div" className="text-danger small" />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Taluk *</label>
                <Field as="select" name="taluk_id" className="form-select">
                  {taluks.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="taluk_id" component="div" className="text-danger small" />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Pincode *</label>
                <Field name="pincode" className="form-control" placeholder="100001" />
                <ErrorMessage name="pincode" component="div" className="text-danger small" />
              </div>

              <div className="col-12 mt-4 d-flex justify-content-between">
                <button type="button" className="btn btn-outline-secondary px-4" onClick={handleBack}><i className="bi bi-arrow-left me-1"></i> Back</button>
                <button type="submit" className="btn btn-maroon px-4">Continue to Organization <i className="bi bi-arrow-right ms-1"></i></button>
              </div>
            </Form>
          </Formik>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <Formik initialValues={formData} validationSchema={step3Schema} onSubmit={handleNext}>
            <Form className="row g-3">
              <h5 className="text-maroon fw-bold border-bottom pb-2 mb-3">Step 3: Organization Details & Unit</h5>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Membership Tier *</label>
                <Field as="select" name="membership_type_id" className="form-select">
                  {membershipTypes.map(mt => (
                    <option key={mt.id} value={mt.id}>{mt.name} (${mt.fee})</option>
                  ))}
                </Field>
                <ErrorMessage name="membership_type_id" component="div" className="text-danger small" />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Preferred Local Unit *</label>
                <Field as="select" name="unit_id" className="form-select">
                  {units.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="unit_id" component="div" className="text-danger small" />
              </div>

              <div className="col-12 mt-4 d-flex justify-content-between">
                <button type="button" className="btn btn-outline-secondary px-4" onClick={handleBack}><i className="bi bi-arrow-left me-1"></i> Back</button>
                <button type="submit" className="btn btn-maroon px-4">Review & Consent <i className="bi bi-arrow-right ms-1"></i></button>
              </div>
            </Form>
          </Formik>
        )}

        {/* STEP 4 */}
        {currentStep === 4 && (
          <Formik initialValues={formData} validationSchema={step4Schema} onSubmit={handleSubmitFinal}>
            <Form className="row g-3">
              <h5 className="text-maroon fw-bold border-bottom pb-2 mb-3">Step 4: Terms & Data Consent</h5>

              <div className="col-12">
                <div className="p-3 bg-light rounded border mb-3 small text-muted">
                  <h6>Data Privacy & Civic Conduct Disclaimer</h6>
                  <p className="mb-1">
                    By submitting this application, you declare that all information provided is accurate. Your personal address and phone numbers are securely protected and will never be encoded inside public QR codes.
                  </p>
                </div>

                <div className="form-check">
                  <Field type="checkbox" name="consent_terms" id="consent_terms" className="form-check-input" />
                  <label htmlFor="consent_terms" className="form-check-label small fw-semibold">
                    I accept the Organization Terms & Conditions and Privacy Policy *
                  </label>
                </div>
                <ErrorMessage name="consent_terms" component="div" className="text-danger small mt-1" />
              </div>

              <div className="col-12 mt-4 d-flex justify-content-between">
                <button type="button" className="btn btn-outline-secondary px-4" onClick={handleBack}><i className="bi bi-arrow-left me-1"></i> Back</button>
                <button type="submit" className="btn btn-gold px-5">Submit Application <i className="bi bi-check-lg ms-1"></i></button>
              </div>
            </Form>
          </Formik>
        )}
      </div>
    </div>
  );
};
