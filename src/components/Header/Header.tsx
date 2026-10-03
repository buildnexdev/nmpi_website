import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { useLanguage } from '../../context/LanguageContext';
import './Header.css';

export const Header: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { lang, setLang, t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLang(lang === 'ta' ? 'en' : 'ta');
  };

  return (
    <header className="dmk-style-header">
      <div className="container-fluid px-lg-4">
        <nav className="navbar navbar-expand-xl navbar-dark p-0">
          {/* Left Brand Emblem & Title */}
          <Link className="brand-wrapper me-4" to="/">
            <img src="/logo.jpg" alt="Netaji Emblem" className="brand-logo-img-dmk" />
            <span className="brand-text-dmk">
              {lang === 'ta' ? 'நேதாஜி மக்கள் பாதுகாப்பு இயக்கம்' : 'Netaji Makkal Pathukappu Iyakkam'}
            </span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            className="navbar-toggler border-secondary"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#dmkNavbar"
            aria-controls="dmkNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Links */}
          <div className="collapse navbar-collapse" id="dmkNavbar">
            <ul className="navbar-nav mx-auto mb-2 mb-xl-0 align-items-xl-center">
              {/* Home */}
              <li className="nav-item">
                <NavLink className="nav-link nav-link-dmk" to="/">
                  <span>{lang === 'ta' ? 'முகப்பு' : 'Home'}</span>
                  <i className="bi bi-chevron-down nav-caret"></i>
                </NavLink>
              </li>

              {/* Party / Iyakkam Dropdown */}
              <li className="nav-item dropdown">
                <a className="nav-link nav-link-dmk dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <span>{lang === 'ta' ? 'இயக்கம்' : 'Iyakkam'}</span>
                  <i className="bi bi-chevron-down nav-caret"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-black">
                  <li>
                    <Link className="dropdown-item" to="/about">
                      {lang === 'ta' ? 'இயக்கம் பற்றி' : 'About Iyakkam'}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/ideology">
                      {lang === 'ta' ? 'கொள்கைகள்' : 'Ideology & Principles'}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/actions">
                      {lang === 'ta' ? 'செயல்பாடுகள்' : 'Actions & Initiatives'}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/leadership">
                      {lang === 'ta' ? 'நிர்வாகிகள்' : 'Leadership Roster'}
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Achievements */}
              <li className="nav-item">
                <NavLink className="nav-link nav-link-dmk" to="/achievements">
                  <span>{lang === 'ta' ? 'சாதனைகள்' : 'Achievements'}</span>
                </NavLink>
              </li>

              {/* News / Publications Dropdown */}
              <li className="nav-item dropdown">
                <a className="nav-link nav-link-dmk dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <span>{lang === 'ta' ? 'செய்திகள்' : 'News'}</span>
                  <i className="bi bi-chevron-down nav-caret"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-black">
                  <li>
                    <Link className="dropdown-item" to="/news">
                      {lang === 'ta' ? 'அண்மை செய்திகள்' : 'Latest Bulletins'}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/news">
                      {lang === 'ta' ? 'அதிகாரப்பூர்வ அறிக்கைகள்' : 'Official Statements'}
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Events Dropdown */}
              <li className="nav-item dropdown">
                <a className="nav-link nav-link-dmk dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <span>{lang === 'ta' ? 'நிகழ்வுகள்' : 'Events'}</span>
                  <i className="bi bi-chevron-down nav-caret"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-black">
                  <li>
                    <Link className="dropdown-item" to="/events">
                      {lang === 'ta' ? 'வரவிருக்கும் நிகழ்வுகள்' : 'Upcoming Events'}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/gallery">
                      {lang === 'ta' ? 'புகைப்படங்கள்' : 'Photo Gallery'}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/history">
                      {lang === 'ta' ? 'வரலாறு' : 'History'}
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Organization */}
              <li className="nav-item">
                <NavLink className="nav-link nav-link-dmk" to="/structure">
                  <span>{lang === 'ta' ? 'அமைப்பு' : 'Organization'}</span>
                </NavLink>
              </li>
            </ul>

            {/* Right Side Control Bar: Language Switcher Pill, Social Media Badges, Join & Login */}
            <div className="d-flex align-items-center gap-3 mt-3 mt-xl-0">
              {/* Language Switcher Pill Switch */}
              <div className="lang-switch-wrapper" onClick={toggleLanguage} title={lang === 'ta' ? 'Switch to English' : 'ஆங்கிலத்திற்கு மாறுங்கள்'}>
                <div className={`lang-switch-pill ${lang === 'en' ? 'active-en' : ''}`}>
                  <div className="lang-switch-knob">
                    {lang === 'ta' ? 'த' : 'E'}
                  </div>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className="social-icons-group d-none d-sm-flex">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-badge fb" title="Facebook">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-badge insta" title="Instagram">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-badge tw" title="Twitter/X">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-badge yt" title="YouTube">
                  <i className="bi bi-youtube"></i>
                </a>
              </div>

              {/* Auth / CTA Buttons */}
              {isAuthenticated ? (
                <div className="dropdown">
                  <button className="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
                    <i className="bi bi-person-circle text-danger fs-6"></i>
                    <span>{user?.member?.full_name || user?.email}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-black">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person-vcard me-2"></i>My Profile & Digital ID
                      </Link>
                    </li>
                    {user?.roles?.some((r: string) => ['SUPER_ADMIN', 'ADMIN'].includes(r)) && (
                      <li>
                        <a className="dropdown-item text-warning" href="http://localhost:3001" target="_blank" rel="noreferrer">
                          <i className="bi bi-speedometer2 me-2"></i>Admin Web Portal
                        </a>
                      </li>
                    )}
                    <li><hr className="dropdown-divider bg-secondary" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Link to="/join" className="btn btn-danger btn-sm px-3 fw-bold">
                    {lang === 'ta' ? 'இணையுங்கள்' : 'Join Us'}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
