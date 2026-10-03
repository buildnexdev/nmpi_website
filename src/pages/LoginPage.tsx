import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { apiClient, errorMessage } from '../services/apiClient';
import { setCredentials } from '../store/authSlice';
import { RootState } from '../store';
import { useLanguage } from '../context/LanguageContext';

export const LoginPage: React.FC = () => {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const from = (location.state as { from?: string } | null)?.from || '/profile';

  if (isAuthenticated) return <Navigate to={from} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post('/auth/login', { login: login.trim(), password });
      dispatch(setCredentials(res.data.data));
      navigate(from, { replace: true });
    } catch (err) {
      setError(errorMessage(err, ta ? 'மின்னஞ்சல்/கைபேசி எண் அல்லது கடவுச்சொல் தவறானது.' : 'Invalid email/mobile number or password.'));
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-art">
        <span className="eyebrow text-gold">{ta ? 'உறுப்பினர் தளம்' : 'Member portal'}</span>
        <h2>{ta ? 'உங்கள் டிஜிட்டல் அடையாளம், ஒரே இடத்தில்.' : 'Your digital identity, in one place.'}</h2>
        <p className="mb-0">{ta ? 'உங்கள் சுயவிவரம், QR சரிபார்ப்பு அடையாள அட்டை மற்றும் உறுப்பினர் நிலையைப் பாருங்கள்.' : 'View your profile, QR-verified ID card and membership status.'}</p>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-card">
          <div className="text-center mb-4">
            <img src="/logo.jpg" alt="NMPI" width={64} height={64} className="rounded-circle mb-3" />
            <h1 className="h3 mb-1">{ta ? 'உறுப்பினர் உள்நுழைவு' : 'Member login'}</h1>
            <p className="text-muted small mb-0">{ta ? 'பதிவு செய்த மின்னஞ்சல் அல்லது கைபேசி எண்ணைப் பயன்படுத்துங்கள்' : 'Use the email or mobile number you registered with'}</p>
          </div>

          {error && <div className="alert alert-danger small" role="alert">{error}</div>}

          <form onSubmit={submit} noValidate>
            <div className="mb-3">
              <label htmlFor="login" className="form-label small fw-semibold">{ta ? 'மின்னஞ்சல் அல்லது கைபேசி எண்' : 'Email or mobile number'}</label>
              <input id="login" className="form-control form-control-lg" autoComplete="username" value={login} onChange={(e) => setLogin(e.target.value)} required autoFocus />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label small fw-semibold">{ta ? 'கடவுச்சொல்' : 'Password'}</label>
              <div className="input-group">
                <input id="password" type={showPassword ? 'text' : 'password'} className="form-control form-control-lg" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-maroon btn-lg w-100" disabled={loading || !login.trim() || !password}>
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-box-arrow-in-right me-2"></i>}
              {ta ? 'உள்நுழைக' : 'Sign in'}
            </button>
          </form>

          <p className="text-center small text-muted mt-4 mb-0">
            {ta ? 'இன்னும் உறுப்பினராகவில்லையா?' : 'Not a member yet?'}{' '}
            <Link to="/join" className="fw-semibold">{ta ? 'இலவசமாகப் பதிவு செய்யுங்கள்' : 'Register for free'}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
