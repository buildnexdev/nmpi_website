import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { useLanguage } from '../../context/LanguageContext';
import { mediaUrl } from '../../services/apiClient';
import { CONTACT_CITY, CONTACT_CITY_TA, CONTACT_PHONE, CONTACT_PHONE_TEL, SOCIAL_LINKS } from '../../constants/contact';
import './Header.css';

type Label = { ta: string; en: string };
interface NavEntry {
  label: Label;
  to?: string;
  children?: { label: Label; to: string; icon: string }[];
}

const NAV: NavEntry[] = [
  { label: { ta: 'முகப்பு', en: 'Home' }, to: '/' },
  {
    label: { ta: 'இயக்கம்', en: 'About' },
    children: [
      { label: { ta: 'இயக்கம் பற்றி', en: 'About Us' }, to: '/about', icon: 'bi-info-circle' },
      { label: { ta: 'கொள்கைகள்', en: 'Ideology' }, to: '/ideology', icon: 'bi-compass' },
      { label: { ta: 'வரலாறு', en: 'History' }, to: '/history', icon: 'bi-hourglass-split' },
      { label: { ta: 'சாதனைகள்', en: 'Achievements' }, to: '/achievements', icon: 'bi-trophy' },
      { label: { ta: 'செயல்பாடுகள்', en: 'Actions' }, to: '/actions', icon: 'bi-lightning-charge' },
    ],
  },
  {
    label: { ta: 'அமைப்பு', en: 'Organisation' },
    children: [
      { label: { ta: 'மாவட்ட நிர்வாகிகள்', en: 'District Executives' }, to: '/leadership', icon: 'bi-people' },
      { label: { ta: 'அமைப்பு கட்டமைப்பு', en: 'Structure' }, to: '/structure', icon: 'bi-diagram-3' },
      { label: { ta: 'இயக்க அணிகள்', en: 'Wings' }, to: '/wings', icon: 'bi-grid' },
    ],
  },
  {
    label: { ta: 'ஊடகம்', en: 'Media' },
    children: [
      { label: { ta: 'செய்திகள்', en: 'News' }, to: '/news', icon: 'bi-newspaper' },
      { label: { ta: 'நிகழ்வுகள்', en: 'Events' }, to: '/events', icon: 'bi-calendar-event' },
      { label: { ta: 'புகைப்படங்கள்', en: 'Gallery' }, to: '/gallery', icon: 'bi-images' },
    ],
  },
  { label: { ta: 'தொடர்புக்கு', en: 'Contact' }, to: '/contact' },
];


export const Header: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { lang, setLang } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setDrawerOpen(false);
    setOpenMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        setDrawerOpen(false);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const handleLogout = () => {
    dispatch(logout());
    setOpenMenu(null);
    navigate('/');
  };

  const isGroupActive = (entry: NavEntry) => entry.children?.some((c) => location.pathname.startsWith(c.to));
  const firstName = user?.member?.full_name?.split(' ')[0] || (lang === 'ta' ? 'என் கணக்கு' : 'My account');

  const LangToggle = (
    <button
      type="button"
      className="lang-toggle"
      onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
      aria-label={lang === 'ta' ? 'Switch to English' : 'தமிழுக்கு மாறவும்'}
    >
      <span className={lang === 'ta' ? 'on' : ''}>தமிழ்</span>
      <span className={lang === 'en' ? 'on' : ''}>EN</span>
    </button>
  );

  return (
    <header ref={headerRef} className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="topbar d-none d-lg-block">
        <div className="container d-flex align-items-center justify-content-between">
          <span>
            <i className="bi bi-geo-alt-fill me-1"></i>
            {lang === 'ta' ? CONTACT_CITY_TA : CONTACT_CITY}
            <span className="mx-3 opacity-50">|</span>
            <a href={CONTACT_PHONE_TEL}><i className="bi bi-telephone-fill me-1"></i>{CONTACT_PHONE}</a>
          </span>
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex gap-1">
              {SOCIAL_LINKS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="topbar-social" aria-label={s.label}>
                  <i className={`bi ${s.icon}`}></i>
                </a>
              ))}
            </div>
            {LangToggle}
          </div>
        </div>
      </div>

      <div className="mainbar">
        <div className="container d-flex align-items-center gap-3">
          <Link to="/" className="brand" aria-label="NMPI home">
            <img src="/logo.jpg" alt="" />
            <span className="brand-text">
              <span className="brand-ta">நேதாஜி மக்கள் பாதுகாப்பு இயக்கம்</span>
              <span className="brand-en">Netaji Makkal Pathukappu Iyakkam</span>
            </span>
          </Link>

          <nav className="main-nav d-none d-xl-flex" aria-label="Main">
            {NAV.map((entry) =>
              entry.children ? (
                <div key={entry.label.en} className={`nav-group ${openMenu === entry.label.en ? 'open' : ''}`}>
                  <button
                    type="button"
                    className={`nav-item-link ${isGroupActive(entry) ? 'active' : ''}`}
                    aria-expanded={openMenu === entry.label.en}
                    onClick={() => setOpenMenu((m) => (m === entry.label.en ? null : entry.label.en))}
                  >
                    {entry.label[lang]} <i className="bi bi-chevron-down caret"></i>
                  </button>
                  <div className="nav-dropdown" role="menu">
                    {entry.children.map((c) => (
                      <NavLink key={c.to} to={c.to} className="nav-dropdown-link" role="menuitem">
                        <i className={`bi ${c.icon}`}></i>
                        {c.label[lang]}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink key={entry.to} to={entry.to!} end={entry.to === '/'} className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
                  {entry.label[lang]}
                </NavLink>
              )
            )}
          </nav>

          <div className="header-actions ms-auto">
            <div className="d-lg-none">{LangToggle}</div>
            {isAuthenticated ? (
              <div className={`nav-group account-menu d-none d-md-block ${openMenu === 'account' ? 'open' : ''}`}>
                <button type="button" className="account-chip" onClick={() => setOpenMenu((m) => (m === 'account' ? null : 'account'))} aria-expanded={openMenu === 'account'}>
                  {user?.member?.profile_image ? (
                    <img src={mediaUrl(user.member.profile_image)} alt="" />
                  ) : (
                    <i className="bi bi-person-circle"></i>
                  )}
                  <span className="text-truncate">{firstName}</span>
                  <i className="bi bi-chevron-down caret"></i>
                </button>
                <div className="nav-dropdown nav-dropdown-end" role="menu">
                  <Link to="/profile" className="nav-dropdown-link" role="menuitem">
                    <i className="bi bi-person-vcard"></i>
                    {lang === 'ta' ? 'என் டிஜிட்டல் அடையாள அட்டை' : 'My Digital ID'}
                  </Link>
                  <button type="button" className="nav-dropdown-link text-danger" onClick={handleLogout} role="menuitem">
                    <i className="bi bi-box-arrow-right"></i>
                    {lang === 'ta' ? 'வெளியேறு' : 'Sign out'}
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline-maroon btn-sm d-none d-md-inline-flex align-items-center gap-1" aria-label={lang === 'ta' ? 'உள்நுழைவு' : 'Login'}>
                <i className="bi bi-person"></i>
                <span className="login-label">{lang === 'ta' ? 'உள்நுழைவு' : 'Login'}</span>
              </Link>
            )}
            <Link to="/join" className="btn btn-gold btn-sm d-none d-sm-inline-flex align-items-center gap-1">
              <i className="bi bi-person-plus-fill"></i>
              {lang === 'ta' ? 'இணையுங்கள்' : 'Join'}
            </Link>
            <button type="button" className="menu-toggle d-xl-none" onClick={() => setDrawerOpen(true)} aria-label={lang === 'ta' ? 'மெனு திற' : 'Open menu'}>
              <i className="bi bi-list"></i>
            </button>
          </div>
        </div>
      </div>

      <div className={`drawer-backdrop ${drawerOpen ? 'show' : ''}`} onClick={() => setDrawerOpen(false)}></div>
      <aside className={`mobile-drawer ${drawerOpen ? 'open' : ''}`} aria-hidden={!drawerOpen}>
        <div className="drawer-head">
          <img src="/logo.jpg" alt="" />
          <span className="brand-ta">நேதாஜி மக்கள் பாதுகாப்பு இயக்கம்</span>
          <button type="button" className="menu-toggle ms-auto" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <nav className="drawer-nav">
          {NAV.map((entry) =>
            entry.children ? (
              <div key={entry.label.en} className="drawer-group">
                <div className="drawer-group-title">{entry.label[lang]}</div>
                {entry.children.map((c) => (
                  <NavLink key={c.to} to={c.to} className="drawer-link">
                    <i className={`bi ${c.icon}`}></i>
                    {c.label[lang]}
                  </NavLink>
                ))}
              </div>
            ) : (
              <NavLink key={entry.to} to={entry.to!} end={entry.to === '/'} className="drawer-link">
                {entry.label[lang]}
              </NavLink>
            )
          )}
        </nav>
        <div className="drawer-foot">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="btn btn-maroon w-100 mb-2">
                <i className="bi bi-person-vcard me-2"></i>
                {lang === 'ta' ? 'என் டிஜிட்டல் அடையாள அட்டை' : 'My Digital ID'}
              </Link>
              <button type="button" className="btn btn-outline-maroon w-100" onClick={handleLogout}>
                {lang === 'ta' ? 'வெளியேறு' : 'Sign out'}
              </button>
            </>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-maroon flex-fill">{lang === 'ta' ? 'உள்நுழைவு' : 'Login'}</Link>
              <Link to="/join" className="btn btn-gold flex-fill">{lang === 'ta' ? 'இணையுங்கள்' : 'Join'}</Link>
            </div>
          )}
          <a href={CONTACT_PHONE_TEL} className="d-flex justify-content-center align-items-center gap-2 mt-3 text-decoration-none">
            <i className="bi bi-telephone-fill"></i>{CONTACT_PHONE}
          </a>
          <div className="d-flex justify-content-center gap-2 mt-3">
            {SOCIAL_LINKS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="drawer-social" aria-label={s.label}>
                <i className={`bi ${s.icon}`}></i>
              </a>
            ))}
          </div>
        </div>
      </aside>
    </header>
  );
};
