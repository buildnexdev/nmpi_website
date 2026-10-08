import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { PageHero } from '../components/ui';

interface Wing {
  id: string;
  icon: string;
  color: string;
}

const WINGS_DATA: Wing[] = [
  { id: 'youth', icon: 'bi-lightning-charge-fill', color: '#DC2626' },
  { id: 'women', icon: 'bi-shield-heart-fill', color: '#DB2777' },
  { id: 'student', icon: 'bi-mortarboard-fill', color: '#2563EB' },
  { id: 'legal', icon: 'bi-briefcase-fill', color: '#D4AF37' },
  { id: 'itMedia', icon: 'bi-cpu-fill', color: '#059669' },
  { id: 'farmers', icon: 'bi-tree-fill', color: '#16A34A' },
];

export const WingsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <PageHero
        eyebrow={t('wingsPage.eyebrow')}
        title={t('wingsPage.title')}
        subtitle={t('wingsPage.subtitle')}
      />
      <section className="page-body">
        <div className="container">
          <div className="row g-4">
            {WINGS_DATA.map((w) => (
              <div className="col-md-6 col-lg-4" key={w.id}>
                <div className="card-custom card-hover feature-tile h-100" style={{ borderTop: `4px solid ${w.color}` }}>
                  <div className="feature-icon" style={{ background: `${w.color}1a`, color: w.color }}>
                    <i className={`bi ${w.icon}`}></i>
                  </div>
                  <h2 className="h5">{t(`wingsPage.wings.${w.id}.name`)}</h2>
                  <p className="mb-0">{t(`wingsPage.wings.${w.id}.description`)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="cta-band mt-5 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <h2 className="h4 mb-1">{t('wingsPage.ctaTitle')}</h2>
              <p className="mb-0">{t('wingsPage.ctaText')}</p>
            </div>
            <Link to="/join" className="btn btn-gold">{t('wingsPage.ctaButton')}</Link>
          </div>
        </div>
      </section>
    </>
  );
};
