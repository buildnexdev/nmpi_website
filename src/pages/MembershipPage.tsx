import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { PageHero } from '../components/ui';

const STEP_ICONS = ['bi-pencil-square', 'bi-geo-alt', 'bi-qr-code'];

const TIERS = [
  { key: 'member', featured: true },
  { key: 'volunteer', featured: false },
];

export const MembershipPage: React.FC = () => {
  const { t, tRaw } = useLanguage();
  const steps = tRaw<{ title: string; text: string }[]>('membershipPage.steps') ?? [];

  return (
    <>
      <PageHero
        eyebrow={t('membershipPage.eyebrow')}
        title={t('membershipPage.title')}
        subtitle={t('membershipPage.subtitle')}
      />
      <section className="page-body">
        <div className="container">
          <div className="row g-4 justify-content-center mb-5">
            {TIERS.map((tier) => (
              <div className="col-md-6 col-lg-5" key={tier.key}>
                <div className={`card-custom p-4 p-md-5 h-100 d-flex flex-column ${tier.featured ? 'border-2' : ''}`} style={tier.featured ? { borderColor: 'var(--accent-gold)' } : undefined}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h2 className="h4 mb-0">{t(`membershipPage.tiers.${tier.key}.title`)}</h2>
                    {tier.featured && <span className="gold-badge">{t('membershipPage.mostPopular')}</span>}
                  </div>
                  <div className="display-6 fw-bold text-maroon mb-3">{t('membershipPage.free')}</div>
                  <ul className="check-list mb-4">
                    {(tRaw<string[]>(`membershipPage.tiers.${tier.key}.points`) ?? []).map((p) => <li key={p}>{p}</li>)}
                  </ul>
                  <Link to="/join" className={`btn ${tier.featured ? 'btn-maroon' : 'btn-outline-maroon'} mt-auto`}>
                    {t('membershipPage.registerNow')}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="section-head centered">
            <div className="eyebrow">{t('membershipPage.howItWorks')}</div>
            <h2 className="section-title">{t('membershipPage.threeSteps')}</h2>
          </div>
          <div className="row g-4">
            {STEP_ICONS.map((icon, i) => (
              <div className="col-md-4" key={icon}>
                <div className="card-custom feature-tile h-100">
                  <div className={`feature-icon ${i === 2 ? 'gold' : ''}`}><i className={`bi ${icon}`}></i></div>
                  <div className="small text-muted fw-bold">{t('membershipPage.stepNumber', { number: i + 1 })}</div>
                  <h3 className="h5">{steps[i]?.title}</h3>
                  <p className="mb-0">{steps[i]?.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
