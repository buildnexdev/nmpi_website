import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { translate, useLanguage } from '../../context/LanguageContext';
import { mediaUrl } from '../../services/apiClient';
import { CONTACT_PHONE, CONTACT_PHONE_TEL, SOCIAL_LINKS } from '../../constants/contact';
import './Header.css';

interface NavEntry {
  labelKey: string;
  to?: string;
  children?: { labelKey: string; to: string; icon: string }[];
}

const NAV: NavEntry[] = [
  { labelKey: 'nav.home', to: '/' },
  {
    labelKey: 'header.nav.movement',
    children: [
      { labelKey: 'header.nav.aboutUs', to: '/about', icon: 'bi-info-circle' },
      { labelKey: 'header.nav.ideology', to: '/ideology', icon: 'bi-compass' },
      { labelKey: 'nav.history', to: '/history', icon: 'bi-hourglass-split' },
      { labelKey: 'nav.achievements', to: '/achievements', icon: 'bi-trophy' },
      { labelKey: 'header.nav.actions', to: '/actions', icon: 'bi-lightning-charge' },
    ],
  },
  {
    labelKey: 'header.nav.organisation',
    children: [
      { labelKey: 'header.nav.districtExecutives', to: '/leadership', icon: 'bi-people' },
      { labelKey: 'header.nav.structure', to: '/structure', icon: 'bi-diagram-3' },
      { labelKey: 'header.nav.wings', to: '/wings', icon: 'bi-grid' },
    ],
  },
  {
    labelKey: 'header.nav.media',
    children: [
      { labelKey: 'header.nav.news', to: '/news', icon: 'bi-newspaper' },
      { labelKey: 'nav.events', to: '/events', icon: 'bi-calendar-event' },
      { labelKey: 'nav.gallery', to: '/gallery', icon: 'bi-images' },
    ],
  },
  { labelKey: 'header.nav.contact', to: '/contact' },
];


export const Header: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { lang, setLang, t } = useLanguage();
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
  const firstName = user?.member?.full_name?.split(' ')[0] || t('header.myAccount');
  const brandTa = translate('ta', 'common.brandName');
  const brandEn = translate('en', 'common.brandName');

  const LangToggle = (
    <button
      type="button"
      className="lang-toggle"
      onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
      aria-label={t('header.switchLanguage')}
    >
      <span className={lang === 'ta' ? 'on' : ''}>{t('common.langTamil')}</span>
      <span className={lang === 'en' ? 'on' : ''}>{t('header.langEnShort')}</span>
    </button>
  );

  return (
    <header ref={headerRef} className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="topbar d-none d-lg-block">
        <div className="container d-flex align-items-center justify-content-between">
          <span>
            <i className="bi bi-geo-alt-fill me-1"></i>
            {t('contactInfo.city')}
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
          <Link to="/" className="brand" aria-label={t('header.brandHomeAria')}>
            <img src="/logo.jpg" alt="" />
            <span className="brand-text">
              <span className="brand-ta">{brandTa}</span>
              <span className="brand-en">{brandEn}</span>
            </span>
          </Link>

          <nav className="main-nav d-none d-xl-flex" aria-label={t('header.mainNavAria')}>
            {NAV.map((entry) =>
              entry.children ? (
                <div key={entry.labelKey} className={`nav-group ${openMenu === entry.labelKey ? 'open' : ''}`}>
                  <button
                    type="button"
                    className={`nav-item-link ${isGroupActive(entry) ? 'active' : ''}`}
                    aria-expanded={openMenu === entry.labelKey}
                    onClick={() => setOpenMenu((m) => (m === entry.labelKey ? null : entry.labelKey))}
                  >
                    {t(entry.labelKey)} <i className="bi bi-chevron-down caret"></i>
                  </button>
                  <div className="nav-dropdown" role="menu">
                    {entry.children.map((c) => (
                      <NavLink key={c.to} to={c.to} className="nav-dropdown-link" role="menuitem">
                        <i className={`bi ${c.icon}`}></i>
                        {t(c.labelKey)}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink key={entry.to} to={entry.to!} end={entry.to === '/'} className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
                  {t(entry.labelKey)}
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
                    {t('header.myDigitalId')}
                  </Link>
                  <button type="button" className="nav-dropdown-link text-danger" onClick={handleLogout} role="menuitem">
                    <i className="bi bi-box-arrow-right"></i>
                    {t('header.signOut')}
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline-maroon btn-sm d-none d-md-inline-flex align-items-center gap-1" aria-label={t('header.login')}>
                <i className="bi bi-person"></i>
                <span className="login-label">{t('header.login')}</span>
              </Link>
            )}
            <Link to="/join" className="btn btn-gold btn-sm d-none d-sm-inline-flex align-items-center gap-1">
              <i className="bi bi-person-plus-fill"></i>
              {t('header.join')}
            </Link>
            <button type="button" className="menu-toggle d-xl-none" onClick={() => setDrawerOpen(true)} aria-label={t('header.openMenu')}>
              <i className="bi bi-list"></i>
            </button>
          </div>
        </div>
      </div>

      <div className={`drawer-backdrop ${drawerOpen ? 'show' : ''}`} onClick={() => setDrawerOpen(false)}></div>
      <aside className={`mobile-drawer ${drawerOpen ? 'open' : ''}`} aria-hidden={!drawerOpen}>
        <div className="drawer-head">
          <img src="/logo.jpg" alt="" />
          <span className="brand-ta">{brandTa}</span>
          <button type="button" className="menu-toggle ms-auto" onClick={() => setDrawerOpen(false)} aria-label={t('header.closeMenu')}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <nav className="drawer-nav">
          {NAV.map((entry) =>
            entry.children ? (
              <div key={entry.labelKey} className="drawer-group">
                <div className="drawer-group-title">{t(entry.labelKey)}</div>
                {entry.children.map((c) => (
                  <NavLink key={c.to} to={c.to} className="drawer-link">
                    <i className={`bi ${c.icon}`}></i>
                    {t(c.labelKey)}
                  </NavLink>
                ))}
              </div>
            ) : (
              <NavLink key={entry.to} to={entry.to!} end={entry.to === '/'} className="drawer-link">
                {t(entry.labelKey)}
              </NavLink>
            )
          )}
        </nav>
        <div className="drawer-foot">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="btn btn-maroon w-100 mb-2">
                <i className="bi bi-person-vcard me-2"></i>
                {t('header.myDigitalId')}
              </Link>
              <button type="button" className="btn btn-outline-maroon w-100" onClick={handleLogout}>
                {t('header.signOut')}
              </button>
            </>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-maroon flex-fill">{t('header.login')}</Link>
              <Link to="/join" className="btn btn-gold flex-fill">{t('header.join')}</Link>
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
