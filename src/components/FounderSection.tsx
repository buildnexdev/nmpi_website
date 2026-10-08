import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import founderImage from '../assets/FounderImage.jpg';

/** Founder photo with the movement's closing message (`founder.*` in src/lang). */
export const FounderSection: React.FC<{ showPoliciesLink?: boolean }> = ({ showPoliciesLink = false }) => {
  const { t, tRaw } = useLanguage();
  const goal = tRaw<string[]>('founder.goal') ?? [];
  const slogans = tRaw<string[]>('founder.slogans') ?? [];

  return (
    <section className="section section-dark founder-section">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-5">
            <figure className="founder-photo">
              <img src={founderImage} alt={t('founder.photoAlt')} loading="lazy" />
              <figcaption>
                <strong>{t('founder.name')}</strong>
                <span>{t('founder.role')}</span>
              </figcaption>
            </figure>
          </div>
          <div className="col-lg-7">
            <div className="eyebrow">{t('founder.eyebrow')}</div>
            <p className="founder-movement">{t('founder.movement')}</p>
            <h2 className="founder-goal">
              {goal.map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </h2>
            <div className="founder-sign">
              <span>{t('founder.role')}</span>
              <strong>{t('founder.name')}</strong>
            </div>
            <ul className="founder-slogans">
              {slogans.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
            {showPoliciesLink && (
              <Link to="/ideology" className="btn btn-gold mt-2">
                {t('founder.readPolicies')}<i className="bi bi-arrow-right ms-2"></i>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
