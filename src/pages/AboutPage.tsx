import React from 'react';
import { Link } from 'react-router-dom';
import { CmsPage } from '../components/CmsPage';
import { useLanguage } from '../context/LanguageContext';
import { mediaUrl } from '../services/apiClient';

export const AboutPage: React.FC = () => {
  const { t, tRaw } = useLanguage();
  const values = tRaw<string[]>('aboutPage.values') ?? [];

  const aside = (
    <div className="d-flex flex-column gap-4">
      <img src={mediaUrl('/uploads/IMG-20260925-WA0072.jpg')} alt="" className="w-100 rounded-4 shadow" style={{ aspectRatio: '4 / 3', objectFit: 'cover' }} />
      <div className="card-custom p-4">
        <h3 className="h5 mb-3">{t('aboutPage.valuesTitle')}</h3>
        <ul className="check-list mb-0">
          {values.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      </div>
      <div className="cta-band p-4">
        <h3 className="h5">{t('common.joinMovement')}</h3>
        <p className="small">{t('aboutPage.ctaText')}</p>
        <Link to="/join" className="btn btn-gold btn-sm">{t('common.registerNow')}</Link>
      </div>
    </div>
  );

  return (
    <CmsPage
      pageKey="about"
      eyebrowKey="aboutPage.eyebrow"
      fallbackTitleKey="aboutPage.fallbackTitle"
      image={mediaUrl('/uploads/IMG-20260925-WA0072.jpg')}
      aside={aside}
    />
  );
};
