import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import './Header.css';

export const Header: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="site-header py-2">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-dark p-0">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <div className="bg-white rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: 42, height: 42 }}>
              <i className="bi bi-shield-check text-maroon fs-4"></i>
            </div>
            <div>
              <span className="brand-title d-block leading-none">COMMUNITY PLATFORM</span>
              <small className="text-gold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>CIVIC & ORGANIZATIONAL GOVERNANCE</small>
            </div>
          </Link>

          <button
            className="navbar-toggler border-gold"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link nav-link-custom" to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link nav-link-custom" to="/about">About</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link nav-link-custom" to="/history">History</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link nav-link-custom" to="/leadership">Leadership</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link nav-link-custom" to="/news">News</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link nav-link-custom" to="/events">Events</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link nav-link-custom" to="/gallery">Gallery</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link nav-link-custom" to="/membership">Membership</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link nav-link-custom" to="/contact">Contact</NavLink>
              </li>
            </ul>

            <div className="header-cta-group">
              {isAuthenticated ? (
                <div className="dropdown">
                  <button className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
                    <i className="bi bi-person-circle text-gold"></i>
                    <span>{user?.member?.full_name || user?.email}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow">
                    <li><Link className="dropdown-item" to="/profile"><i className="bi bi-person-vcard me-2"></i>My Profile & Digital ID</Link></li>
                    {user?.roles?.some((r: string) => ['SUPER_ADMIN', 'ADMIN', 'DISTRICT_ADMIN'].includes(r)) && (
                      <li><a className="dropdown-item text-maroon font-bold" href="http://localhost:3001" target="_blank" rel="noreferrer"><i className="bi bi-speedometer2 me-2"></i>Admin Web Portal</a></li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                  </ul>
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline-light btn-sm px-3">Member Login</Link>
                  <Link to="/join" className="btn btn-gold btn-sm px-3">Join Now</Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
