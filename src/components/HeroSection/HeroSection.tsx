import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ImageBgSlider } from '../ImageBgSlider/ImageBgSlider';
import { useHeroSlides } from '../../hooks/useHeroSlides';
import './HeroSection.css';

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const slides = useHeroSlides();

  return (
    <section className="home-hero" aria-label={t('common.brandName')}>
      <ImageBgSlider slides={slides} variant="hero">
        <div className="home-hero-surface">
          <div className="home-hero-inner">
            <p className="home-hero-eyebrow">{t('aboutPage.eyebrow')}</p>
            <h1 className="home-hero-title">{t('common.brandName')}</h1>
            <p className="home-hero-lead">{t('aboutPage.tagline')}</p>
            <div className="home-hero-actions">
              <Link to="/join" className="btn btn-gold btn-lg px-4">
                {t('common.registerNow')} <i className="bi bi-person-plus ms-1"></i>
              </Link>
              <Link to="/about" className="btn btn-outline-light btn-lg px-4">
                {t('aboutPage.eyebrow')} <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
          </div>
        </div>
      </ImageBgSlider>
    </section>
  );
};
