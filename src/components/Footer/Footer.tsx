import React from 'react';
import { Link } from 'react-router-dom';
import { translate, useLanguage } from '../../context/LanguageContext';
import { ADMIN_URL } from '../../services/apiClient';
import { CONTACT_PHONE, CONTACT_PHONE_TEL, SOCIAL_LINKS } from '../../constants/contact';
import './Footer.css';

const COLUMNS = [
  {
    titleKey: 'footer.movement',
    links: [
      { to: '/about', labelKey: 'header.nav.aboutUs' },
      { to: '/ideology', labelKey: 'header.nav.ideology' },
      { to: '/history', labelKey: 'nav.history' },
      { to: '/leadership', labelKey: 'header.nav.districtExecutives' },
      { to: '/achievements', labelKey: 'nav.achievements' },
    ],
  },
  {
    titleKey: 'footer.members',
    links: [
      { to: '/join', labelKey: 'footer.becomeMember' },
      { to: '/login', labelKey: 'common.memberLogin' },
      { to: '/membership', labelKey: 'footer.membershipBenefits' },
      { to: '/faq', labelKey: 'nav.faq' },
    ],
  },
  {
    titleKey: 'footer.newsMedia',
    links: [
      { to: '/news', labelKey: 'header.nav.news' },
      { to: '/events', labelKey: 'nav.events' },
      { to: '/gallery', labelKey: 'nav.gallery' },
      { to: '/contact', labelKey: 'header.nav.contact' },
    ],
  },
];

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-3">
            <div className="footer-brand">
              <img src="/logo.jpg" alt="" />
              <div>
                <div className="footer-brand-ta">{translate('ta', 'common.brandName')}</div>
                <div className="footer-brand-en">{translate('en', 'common.brandName')}</div>
              </div>
            </div>
            <p className="footer-text">{t('footer.tagline')}</p>
            <div className="footer-social">
              {SOCIAL_LINKS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
                  <i className={`bi ${s.icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div className="col-6 col-md-4 col-lg-2" key={col.titleKey}>
              <h5 className="footer-heading">{t(col.titleKey)}</h5>
              <ul className="footer-links">
                {col.links.map((l) => (
                  <li key={l.to}><Link to={l.to}>{t(l.labelKey)}</Link></li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-md-12 col-lg-3">
            <h5 className="footer-heading">{t('footer.headOffice')}</h5>
            <ul className="footer-contact">
              <li><i className="bi bi-geo-alt"></i><span>{t('contactInfo.address')}</span></li>
              <li><i className="bi bi-telephone"></i><a href={CONTACT_PHONE_TEL}>{CONTACT_PHONE}</a></li>
              <li><i className="bi bi-envelope"></i><a href="mailto:nmpiofficial2026@gmail.com">nmpiofficial2026@gmail.com</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container d-flex flex-column flex-md-row gap-2 justify-content-between align-items-center">
          <span>© {new Date().getFullYear()} {t('common.brandName')}</span>
          <span className="d-flex flex-wrap gap-3 justify-content-center">
            <Link to="/privacy-policy">{t('footer.privacy')}</Link>
            <Link to="/terms">{t('footer.terms')}</Link>
            <a href={ADMIN_URL} target="_blank" rel="noreferrer">{t('footer.adminPortal')}</a>
            <span>
              {t('footer.builtBy')}{' '}
              <a href="https://buildnexdev.in" target="_blank" rel="noreferrer">buildnexdev.in</a>
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
};
