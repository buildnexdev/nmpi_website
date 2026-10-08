import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { mediaUrl } from '../../services/apiClient';
import founderImage from '../../assets/FounderImage.jpg';
import './HeroSection.css';

export interface PublicStats {
  members: number;
  leaders: number;
  districts: number;
  upcoming_events: number;
}

const SLIDES = [
  { image: '/uploads/IMG-20260925-WA0072.jpg', captionKey: 'hero.slides.stateGeneralCouncil' },
  { image: '/uploads/IMG-20260925-WA0000.jpg', captionKey: 'hero.slides.zonalConference' },
  { image: '/uploads/IMG-20260925-WA0010.jpg', captionKey: 'hero.slides.districtMeeting' },
  { image: '/uploads/IMG-20260925-WA0011.jpg', captionKey: 'hero.slides.protectionCampaign' },
];

const STAT_ITEMS: { field: keyof PublicStats; labelKey: string; icon: string }[] = [
  { field: 'members', labelKey: 'hero.stats.members', icon: 'bi-people-fill' },
  { field: 'leaders', labelKey: 'hero.stats.leaders', icon: 'bi-person-badge-fill' },
  { field: 'districts', labelKey: 'hero.stats.districts', icon: 'bi-geo-alt-fill' },
  { field: 'upcoming_events', labelKey: 'hero.stats.upcomingEvents', icon: 'bi-calendar-event-fill' },
];

/** `stats`: undefined while loading, null when the request failed (the stats bar is then hidden). */
export const HeroSection: React.FC<{ stats: PublicStats | null | undefined }> = ({ stats }) => {
  const { t, tRaw } = useLanguage();
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const points = tRaw<string[]>('hero.points') ?? [];

  const go = useCallback((step: number) => setSlide((s) => (s + step + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => go(1), 6000);
    return () => clearInterval(timer);
  }, [go, paused, slide]);

  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true"></div>

      <div className="container hero-content">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <span className="hero-pill">
              <i className="bi bi-shield-fill-check"></i>
              {t('hero.pill')}
            </span>
            <h1 className="hero-title">
              {t('hero.titleLead')} <span>{t('hero.titleHighlight')}</span>
            </h1>
            <p className="hero-lead">{t('hero.lead')}</p>
            <ul className="hero-points">
              {points.map((point) => (
                <li key={point}><i className="bi bi-check-circle-fill"></i>{point}</li>
              ))}
            </ul>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/join" className="btn btn-gold btn-lg">
                <i className="bi bi-person-plus-fill me-2"></i>
                {t('hero.becomeMember')}
              </Link>
              <Link to="/about" className="btn btn-ghost-light btn-lg">
                {t('hero.aboutMovement')}
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="hero-visual" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
              <div className="hero-frame">
                {SLIDES.map((s, i) => (
                  <div
                    key={s.image}
                    className={`hero-slide ${i === slide ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${mediaUrl(s.image)}), url(/hero-banner.jpg)` }}
                    role="img"
                    aria-label={t(s.captionKey)}
                    aria-hidden={i !== slide}
                  />
                ))}
                <div className="hero-frame-bar">
                  <span className="hero-frame-caption">{t(SLIDES[slide].captionKey)}</span>
                  <div className="hero-dots">
                    {SLIDES.map((_, i) => (
                      <button key={i} type="button" className={i === slide ? 'active' : ''} onClick={() => setSlide(i)} aria-label={t('hero.slideAria', { number: i + 1 })} />
                    ))}
                  </div>
                </div>
                <button type="button" className="hero-arrow prev" onClick={() => go(-1)} aria-label={t('hero.prevSlide')}>
                  <i className="bi bi-chevron-left"></i>
                </button>
                <button type="button" className="hero-arrow next" onClick={() => go(1)} aria-label={t('hero.nextSlide')}>
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>

              <div className="hero-founder">
                <img src={founderImage} alt={t('founder.photoAlt')} />
                <div>
                  <strong>{t('founder.name')}</strong>
                  <span>{t('founder.role')}</span>
                </div>
              </div>
              <div className="hero-values d-none d-sm-flex">
                <img src="/logo.jpg" alt="" />
                <span>{t('hero.values')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {stats !== null && (
        <div className="container hero-stats-wrap">
          <div className="hero-stats">
            {STAT_ITEMS.map((s) => (
              <div className="hero-stat" key={s.field}>
                <span className="hero-stat-icon"><i className={`bi ${s.icon}`}></i></span>
                <div>
                  {stats === undefined ? (
                    <div className="hero-stat-skeleton" aria-hidden="true"></div>
                  ) : (
                    <div className="hero-stat-value">{(stats[s.field] ?? 0).toLocaleString('en-IN')}</div>
                  )}
                  <div className="hero-stat-label">{t(s.labelKey)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
