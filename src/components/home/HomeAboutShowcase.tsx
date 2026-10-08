import React from 'react';
import { Link } from 'react-router-dom';
import { useCmsPage } from '../CmsPage';
import { useLanguage } from '../../context/LanguageContext';
import { pick, mediaUrl } from '../../services/apiClient';
import { HERO_PHOTO_ALLOWLIST } from '../../hooks/useHeroSlides';
import { HomeVideoGallery } from './HomeVideoGallery';
import './HomeAboutShowcase.css';

const VALUE_ICONS = ['bi-shield-fill-check', 'bi-people-fill', 'bi-heart-fill', 'bi-globe-asia-australia'];
const SIDE_PHOTO = HERO_PHOTO_ALLOWLIST[1] ?? HERO_PHOTO_ALLOWLIST[0];

export const HomeAboutShowcase: React.FC = () => {
  const { lang, t, tRaw } = useLanguage();
  const { page, loading } = useCmsPage('about');
  const values = tRaw<string[]>('aboutPage.values') ?? [];
  const title = page ? pick(page, 'title', lang) : t('aboutPage.fallbackTitle');

  return (
    <section id="home-about" className="home-about-showcase-wrap">
      <div className="home-about-fill" data-reveal="fade">
        <div className="home-about-visual">
          <img src={mediaUrl(SIDE_PHOTO)} alt="" className="home-about-photo" loading="lazy" />
          <div className="home-about-visual-shade" aria-hidden="true" />
          <div className="home-about-visual-badge">
            <span className="home-about-visual-num">132/2026</span>
            <span className="home-about-visual-label">{t('aboutPage.registrationNumberLabel')}</span>
          </div>
        </div>

        <div className="home-about-panel">
          <div className="home-about-panel-inner">
            <p className="home-about-eyebrow">{t('aboutPage.eyebrow')}</p>
            <h2 className="home-about-title">{title}</h2>
            <p className="home-about-lead-text">{t('aboutPage.tagline')}</p>

            <dl className="home-about-reg">
              <div>
                <dt>{t('aboutPage.registrationStartedLabel')}</dt>
                <dd>12.02.2025</dd>
              </div>
              <div>
                <dt>{t('aboutPage.registrationNumberLabel')}</dt>
                <dd>132/2026</dd>
              </div>
            </dl>

            <ul className="home-about-values">
              {values.map((label, i) => (
                <li key={label}>
                  <i className={`bi ${VALUE_ICONS[i % VALUE_ICONS.length]}`} aria-hidden="true"></i>
                  {label}
                </li>
              ))}
            </ul>

            <div className="home-about-actions">
              <Link to="/about" className="btn btn-maroon">
                {t('common.learnMore')} <i className="bi bi-arrow-right ms-1"></i>
              </Link>
              <Link to="/join" className="btn btn-outline-maroon">
                {t('common.registerNow')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {!loading && <HomeVideoGallery variant="band" />}
    </section>
  );
};
