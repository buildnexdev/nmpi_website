import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { mediaUrl } from '../../services/apiClient';
import './HeroSection.css';

export interface PublicStats {
  members: number;
  leaders: number;
  districts: number;
  upcoming_events: number;
}

const SLIDES = [
  { image: '/uploads/IMG-20260925-WA0072.jpg', ta: 'மாநில பொதுக்குழு', en: 'State General Council' },
  { image: '/uploads/IMG-20260925-WA0000.jpg', ta: 'மண்டல மாநாடு & பேரணி', en: 'Zonal Conference & Rally' },
  { image: '/uploads/IMG-20260925-WA0010.jpg', ta: 'மாவட்ட நிர்வாகிகள் கூட்டம்', en: 'District Executives Meeting' },
  { image: '/uploads/IMG-20260925-WA0011.jpg', ta: 'மக்கள் பாதுகாப்பு பிரச்சாரம்', en: 'Public Protection Campaign' },
];

export const HeroSection: React.FC<{ stats: PublicStats | null }> = ({ stats }) => {
  const { lang } = useLanguage();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 7000);
    return () => clearInterval(timer);
  }, []);

  const statItems = [
    { value: stats?.members, ta: 'சரிபார்க்கப்பட்ட உறுப்பினர்கள்', en: 'Verified members' },
    { value: stats?.leaders, ta: 'மாவட்ட நிர்வாகிகள்', en: 'District executives' },
    { value: stats?.districts, ta: 'மாவட்டங்கள்', en: 'Districts covered' },
    { value: stats?.upcoming_events, ta: 'வரவிருக்கும் நிகழ்வுகள்', en: 'Upcoming events' },
  ];

  return (
    <section className="hero">
      <div className="hero-slides" aria-hidden="true">
        {SLIDES.map((s, i) => (
          <div key={s.image} className={`hero-slide ${i === slide ? 'active' : ''}`} style={{ backgroundImage: `url(${mediaUrl(s.image)}), url(/hero-banner.jpg)` }} />
        ))}
      </div>
      <div className="hero-overlay"></div>

      <div className="container hero-content">
        <div className="row align-items-center">
          <div className="col-lg-8 col-xl-7">
            <span className="hero-pill">
              <i className="bi bi-shield-fill-check"></i>
              {lang === 'ta' ? 'தமிழ்நாடு மக்கள் பாதுகாப்பு இயக்கம்' : "Tamil Nadu's people's protection movement"}
            </span>
            <h1 className="hero-title">
              {lang === 'ta' ? (
                <>நேதாஜி மக்கள் <span>பாதுகாப்பு இயக்கம்</span></>
              ) : (
                <>Netaji Makkal <span>Pathukappu Iyakkam</span></>
              )}
            </h1>
            <p className="hero-lead">
              {lang === 'ta'
                ? 'நேதாஜி சுபாஷ் சந்திர போஸ் அவர்களின் கொள்கை வழியில் மக்களின் உரிமைகள், சமூக நலன் மற்றும் பாதுகாப்பிற்கான ஒழுக்கமிக்க மக்கள் இயக்கம்.'
                : "A disciplined people's movement for public rights, social welfare and safety — guided by the ideals of Netaji Subhas Chandra Bose."}
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/join" className="btn btn-gold btn-lg">
                <i className="bi bi-person-plus-fill me-2"></i>
                {lang === 'ta' ? 'உறுப்பினராக இணையுங்கள்' : 'Become a member'}
              </Link>
              <Link to="/about" className="btn btn-ghost-light btn-lg">
                {lang === 'ta' ? 'இயக்கம் பற்றி' : 'About the movement'}
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </div>

        <div className="hero-caption d-none d-md-flex">
          <span>{lang === 'ta' ? SLIDES[slide].ta : SLIDES[slide].en}</span>
          <div className="hero-dots">
            {SLIDES.map((_, i) => (
              <button key={i} type="button" className={i === slide ? 'active' : ''} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="container hero-stats-wrap">
        <div className="hero-stats">
          {statItems.map((s) => (
            <div className="hero-stat" key={s.en}>
              <div className="hero-stat-value">{s.value === undefined ? '—' : s.value.toLocaleString('en-IN')}</div>
              <div className="hero-stat-label">{s[lang]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
