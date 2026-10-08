import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCmsPage } from '../components/CmsPage';
import { useLanguage } from '../context/LanguageContext';
import { pick } from '../services/apiClient';
import { parseAboutHtml } from '../utils/aboutPageParse';
import { Loader } from '../components/ui';
import { ImageBgSlider } from '../components/ImageBgSlider/ImageBgSlider';
import { useHeroSlides } from '../hooks/useHeroSlides';
import './AboutPage.css';

const VALUE_ICONS = ['bi-shield-check', 'bi-balance-scale', 'bi-people-fill', 'bi-heart-fill'];
const SECTION_ICONS = ['bi-bullseye', 'bi-signpost-split', 'bi-quote'];

export const AboutPage: React.FC = () => {
  const { lang, t, tRaw } = useLanguage();
  const { page, loading } = useCmsPage('about');
  const values = tRaw<string[]>('aboutPage.values') ?? [];
  const slides = useHeroSlides();
  const title = page ? pick(page, 'title', lang) : t('aboutPage.fallbackTitle');
  const html = page ? pick(page, 'content', lang) : '';
  const { leadHtml, sections } = useMemo(() => (html ? parseAboutHtml(html) : { leadHtml: '', sections: [] }), [html]);

  return (
    <div className="about-v2">
      <header className="about-masthead">
        <ImageBgSlider slides={slides} variant="fill" className="about-masthead-slider">
          <div className="container about-masthead-inner about-masthead-centered">
            <nav className="about-crumb" aria-label="Breadcrumb">
              <Link to="/"><i className="bi bi-house-door-fill" aria-hidden="true"></i> {t('common.home')}</Link>
              <i className="bi bi-chevron-right" aria-hidden="true"></i>
              <span>{t('aboutPage.eyebrow')}</span>
            </nav>
            <p className="about-masthead-eyebrow">{t('aboutPage.eyebrow')}</p>
            <h1 className="about-masthead-title">{title}</h1>
            <p className="about-masthead-lead">{t('aboutPage.tagline')}</p>
            <div className="about-stat-grid about-stat-grid-centered">
              <div className="about-stat">
                <span className="about-stat-label">{t('aboutPage.registrationStartedLabel')}</span>
                <strong>12.02.2025</strong>
              </div>
              <div className="about-stat">
                <span className="about-stat-label">{t('aboutPage.registrationNumberLabel')}</span>
                <strong>132/2026</strong>
              </div>
            </div>
            <ul className="about-pillars about-pillars-centered">
              {values.map((label, i) => (
                <li key={label} data-reveal="fade">
                  <i className={`bi ${VALUE_ICONS[i % VALUE_ICONS.length]}`} aria-hidden="true"></i>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </ImageBgSlider>
        <svg className="about-masthead-wave" viewBox="0 0 1440 56" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,32 C360,56 720,8 1080,28 C1260,38 1380,48 1440,40 L1440,56 L0,56 Z" fill="var(--color-bg, #f6f4f1)" />
        </svg>
      </header>

      <div className="about-v2-body">
        <div className="container">
          {loading ? (
            <Loader label={t('common.loading')} />
          ) : (
            <>
              {leadHtml && (
                <div className="about-intro-card rich-text" data-reveal="fade" dangerouslySetInnerHTML={{ __html: leadHtml }} />
              )}

              <div className="about-section-stack">
                {sections.map((section, index) => (
                  <section key={section.id} className="about-section-card" data-reveal={index % 2 === 0 ? 'left' : 'right'}>
                    <div className="about-section-head">
                      <span className="about-section-num" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="about-section-icon">
                        <i className={`bi ${SECTION_ICONS[index % SECTION_ICONS.length]}`} aria-hidden="true"></i>
                      </span>
                      <h2 className="about-section-title">{section.title}</h2>
                    </div>
                    <div className="about-section-body rich-text" dangerouslySetInnerHTML={{ __html: section.html }} />
                  </section>
                ))}

                {!page && !loading && (
                  <p className="text-muted text-center py-5">{t('common.pageUpdatedSoon')}</p>
                )}
              </div>

              <div className="about-join-strip" data-reveal="zoom">
                <div className="about-join-copy">
                  <h2>{t('common.joinMovement')}</h2>
                  <p>{t('aboutPage.ctaText')}</p>
                </div>
                <div className="about-join-actions">
                  <Link to="/join" className="btn btn-gold btn-lg">
                    {t('common.registerNow')} <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                  <Link to="/ideology" className="btn btn-outline-light btn-lg">
                    {t('aboutPage.readPolicies')} <i className="bi bi-compass ms-1"></i>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
