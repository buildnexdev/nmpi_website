import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { apiClient } from '../services/apiClient';
import { setCredentials } from '../store/authSlice';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiClient.post('/auth/login', { login: loginInput, password });
      dispatch(setCredentials(res.data.data));
      setLoading(false);
      navigate('/profile');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Invalid email/mobile or password.');
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card-custom max-w-md mx-auto p-4 p-md-5" style={{ maxWidth: 450 }}>
        <div className="text-center mb-4">
          <div className="bg-maroon text-gold p-3 rounded-circle d-inline-flex mb-2">
            <i className="bi bi-person-lock fs-2"></i>
          </div>
          <h2 className="h4 text-maroon fw-bold m-0">Member Portal Login</h2>
          <small className="text-muted">Access your verified profile & digital identity</small>
        </div>

        {errorMsg && <div className="alert alert-danger small mb-3">{errorMsg}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email or Mobile Number</label>
            <input
              type="text"
              className="form-control"
              value={loginInput}
              onChange={e => setLoginInput(e.target.value)}
              placeholder="e.g. member1@orgplatform.org"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-maroon w-100 py-2 fw-semibold" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-box-arrow-in-right me-2"></i>}
            Sign In to Account
          </button>
        </form>

        <div className="mt-4 pt-3 border-top text-center small text-muted">
          Demo Credentials: <code>admin@orgplatform.org</code> or <code>member1@orgplatform.org</code> (Password: <code>Password123!</code>)
        </div>
      </div>
    </div>
  );
};
