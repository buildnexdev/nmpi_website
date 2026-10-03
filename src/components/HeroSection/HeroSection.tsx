import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './HeroSection.css';

interface HeroSectionProps {
  stats?: {
    totalMembers: number;
    unitsCount: number;
    districtsCount: number;
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({ stats }) => {
  const { lang, t } = useLanguage();

  return (
    <section className="hero-section">
      <div className="container position-relative z-1">
        <div className="row align-items-center g-5">
          <div className="col-lg-7">
            <div className="hero-badge">
              <i className="bi bi-shield-lock-fill text-gold"></i>{' '}
              {lang === 'ta' ? 'தமிழ்நாடு மாநில பாதுகாப்பு இயக்கம்' : 'TAMIL NADU CIVIC & PROTECTIVE MOVEMENT'}
            </div>
            <h1 className="hero-title mb-3">
              {lang === 'ta' ? (
                <>நேதாஜி மக்கள் <span className="text-gold">பாதுகாப்பு இயக்கம்</span></>
              ) : (
                <>Netaji Makkal <span className="text-gold">Pathukappu Iyakkam</span></>
              )}
            </h1>
            <p className="hero-subtitle mb-4">
              {lang === 'ta'
                ? 'நேதாஜி சுபாஷ் சந்திர போஸ் அவர்களின் கொள்கை வழியில் மக்களின் உரிமைகள், சமூக நலன் மற்றும் பாதுகாப்பிற்கான ஒழுக்கமிக்க மக்கள் இயக்கம்.'
                : 'A unified civic protective movement upholding Netaji Subhash Chandra Bose\'s principles of public service, member protection, and transparent governance.'}
            </p>

            <div className="d-flex flex-wrap gap-3">
              <Link to="/join" className="btn btn-gold btn-lg px-4 py-3 fw-bold">
                <i className="bi bi-person-plus-fill me-2"></i>{t('joinUs')}
              </Link>
              <Link to="/about" className="btn btn-outline-light btn-lg px-4 py-3">
                <i className="bi bi-info-circle me-2"></i>{t('navAboutParty')}
              </Link>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="hero-stats-card text-center">
              <img
                src="/logo.jpg"
                alt="Netaji Emblem"
                className="img-fluid rounded-circle border border-gold mb-3 shadow-lg"
                style={{ width: 140, height: 140, objectFit: 'cover' }}
              />

              <h4 className="h5 text-gold fw-bold mb-1">
                {lang === 'ta' ? 'நேதாஜி மக்கள் பாதுகாப்பு இயக்கம்' : 'Netaji Makkal Pathukappu Iyakkam'}
              </h4>
              <p className="small text-white-50 mb-3">{lang === 'ta' ? 'தமிழ்நாடு தலைமை மையம்' : 'State Headquarters, Tamil Nadu'}</p>

              <div className="row text-center g-2 pt-2 border-top border-secondary">
                <div className="col-6">
                  <div className="p-2 rounded bg-black bg-opacity-25 border border-gold">
                    <div className="h4 text-gold mb-0 fw-bold">10,000+</div>
                    <div className="small text-light" style={{ fontSize: '0.75rem' }}>{lang === 'ta' ? 'உறுப்பினர்கள்' : 'Active Members'}</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-2 rounded bg-black bg-opacity-25 border border-gold">
                    <div className="h4 text-gold mb-0 fw-bold">38</div>
                    <div className="small text-light" style={{ fontSize: '0.75rem' }}>{lang === 'ta' ? 'மாவட்ட பிரிவுகள்' : 'Districts Covered'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
