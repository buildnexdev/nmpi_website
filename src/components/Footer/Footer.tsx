import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ADMIN_URL } from '../../services/apiClient';
import './Footer.css';

export const Footer: React.FC = () => {
  const { lang } = useLanguage();
  const ta = lang === 'ta';

  const columns = [
    {
      title: ta ? 'இயக்கம்' : 'The Movement',
      links: [
        { to: '/about', label: ta ? 'இயக்கம் பற்றி' : 'About Us' },
        { to: '/ideology', label: ta ? 'கொள்கைகள்' : 'Ideology' },
        { to: '/history', label: ta ? 'வரலாறு' : 'History' },
        { to: '/leadership', label: ta ? 'மாவட்ட நிர்வாகிகள்' : 'District Executives' },
        { to: '/achievements', label: ta ? 'சாதனைகள்' : 'Achievements' },
      ],
    },
    {
      title: ta ? 'உறுப்பினர்கள்' : 'Members',
      links: [
        { to: '/join', label: ta ? 'உறுப்பினராக இணையுங்கள்' : 'Become a Member' },
        { to: '/login', label: ta ? 'உறுப்பினர் உள்நுழைவு' : 'Member Login' },
        { to: '/membership', label: ta ? 'உறுப்பினர் நன்மைகள்' : 'Membership Benefits' },
        { to: '/faq', label: ta ? 'கேள்விகள்' : 'FAQ' },
      ],
    },
    {
      title: ta ? 'செய்திகள் & ஊடகம்' : 'News & Media',
      links: [
        { to: '/news', label: ta ? 'செய்திகள்' : 'News' },
        { to: '/events', label: ta ? 'நிகழ்வுகள்' : 'Events' },
        { to: '/gallery', label: ta ? 'புகைப்படங்கள்' : 'Gallery' },
        { to: '/contact', label: ta ? 'தொடர்புக்கு' : 'Contact' },
      ],
    },
  ];

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-4">
            <div className="footer-brand">
              <img src="/logo.jpg" alt="" />
              <div>
                <div className="footer-brand-ta">நேதாஜி மக்கள் பாதுகாப்பு இயக்கம்</div>
                <div className="footer-brand-en">Netaji Makkal Pathukappu Iyakkam</div>
              </div>
            </div>
            <p className="footer-text">
              {ta
                ? 'நேதாஜி சுபாஷ் சந்திர போஸ் அவர்களின் வழியில் மக்களின் உரிமைகள், சமூக நலன் மற்றும் பாதுகாப்பிற்காக செயல்படும் மக்கள் இயக்கம்.'
                : "A people's movement working for the rights, welfare and safety of the public in the spirit of Netaji Subhas Chandra Bose."}
            </p>
            <div className="footer-social">
              {[
                ['https://facebook.com', 'bi-facebook', 'Facebook'],
                ['https://instagram.com', 'bi-instagram', 'Instagram'],
                ['https://twitter.com', 'bi-twitter-x', 'X'],
                ['https://youtube.com', 'bi-youtube', 'YouTube'],
              ].map(([href, icon, label]) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                  <i className={`bi ${icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div className="col-6 col-md-4 col-lg-2" key={col.title}>
              <h5 className="footer-heading">{col.title}</h5>
              <ul className="footer-links">
                {col.links.map((l) => (
                  <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-md-12 col-lg-2">
            <h5 className="footer-heading">{ta ? 'தலைமை அலுவலகம்' : 'Head Office'}</h5>
            <ul className="footer-contact">
              <li><i className="bi bi-geo-alt"></i><span>{ta ? 'அண்ணா சாலை, சென்னை – 600002' : 'Anna Salai, Chennai – 600002'}</span></li>
              <li><i className="bi bi-telephone"></i><a href="tel:+919790875933">+91 97908 75933</a></li>
              <li><i className="bi bi-envelope"></i><a href="mailto:nmpiofficial2026@gmail.com">nmpiofficial2026@gmail.com</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container d-flex flex-column flex-md-row gap-2 justify-content-between align-items-center">
          <span>© {new Date().getFullYear()} {ta ? 'நேதாஜி மக்கள் பாதுகாப்பு இயக்கம்' : 'Netaji Makkal Pathukappu Iyakkam'}</span>
          <span className="d-flex flex-wrap gap-3 justify-content-center">
            <Link to="/privacy-policy">{ta ? 'தனியுரிமை' : 'Privacy'}</Link>
            <Link to="/terms">{ta ? 'விதிமுறைகள்' : 'Terms'}</Link>
            <a href={ADMIN_URL} target="_blank" rel="noreferrer">{ta ? 'நிர்வாகி உள்நுழைவு' : 'Admin portal'}</a>
            <span>
              {ta ? 'உருவாக்கம்:' : 'Built by'}{' '}
              <a href="https://buildnexdev.in" target="_blank" rel="noreferrer">buildnexdev.in</a>
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
};
