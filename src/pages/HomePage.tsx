import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection/HeroSection';
import { NewsCard } from '../components/NewsCard/NewsCard';
import { apiClient } from '../services/apiClient';
import { useLanguage } from '../context/LanguageContext';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [leadersList, setLeadersList] = useState<any[]>([]);
  const { lang, t } = useLanguage();

  useEffect(() => {
    apiClient.get('/news?status=PUBLISHED').then(res => setNewsList(res.data.data.slice(0, 3))).catch(() => {});
    apiClient.get('/events?status=UPCOMING').then(res => setEventsList(res.data.data.slice(0, 2))).catch(() => {});
    apiClient.get('/leadership').then(res => setLeadersList(res.data.data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div>
      <HeroSection />

      {/* Latest News Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="text-gold fw-bold text-uppercase small">
                {lang === 'ta' ? 'அதிகாரப்பூர்வ செய்திகள்' : 'Official Bulletins'}
              </span>
              <h2 className="home-section-heading m-0">
                {lang === 'ta' ? 'இயக்கத்தின் முக்கிய செய்திகள்' : 'Latest News & Bulletins'}
              </h2>
            </div>
            <Link to="/news" className="btn btn-outline-danger btn-sm">
              {lang === 'ta' ? 'அனைத்து செய்திகளும்' : 'View All News'} <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          <div className="row g-4">
            {newsList.map(item => (
              <div className="col-lg-4 col-md-6" key={item.id}>
                <NewsCard
                  id={item.id}
                  title={item.title}
                  summary={item.summary}
                  category={item.category_name || 'Announcement'}
                  publishedAt={item.published_at}
                  coverImage={item.cover_image}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="text-gold fw-bold text-uppercase small">
                {lang === 'ta' ? 'நிகழ்ச்சி நிரல்' : 'Community Calendar'}
              </span>
              <h2 className="home-section-heading m-0">
                {lang === 'ta' ? 'வரவிருக்கும் நிகழ்வுகள்' : 'Upcoming Events & Rallies'}
              </h2>
            </div>
            <Link to="/events" className="btn btn-outline-danger btn-sm">
              {lang === 'ta' ? 'அனைத்து நிகழ்வுகளும்' : 'View Event Calendar'} <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          <div className="row g-4">
            {eventsList.map(evt => (
              <div className="col-lg-6" key={evt.id}>
                <div className="card-custom p-3 d-flex flex-column flex-sm-row gap-3 align-items-center">
                  <img
                    src={evt.cover_image || 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800'}
                    alt={evt.title}
                    className="rounded"
                    style={{ width: 140, height: 120, objectFit: 'cover' }}
                  />
                  <div>
                    <div className="badge gold-badge mb-2">
                      <i className="bi bi-calendar-event me-1"></i>{evt.event_date}
                    </div>
                    <h5 className="h6 text-maroon fw-bold mb-2">{evt.title}</h5>
                    <p className="small text-muted mb-2"><i className="bi bi-geo-alt me-1 text-gold"></i>{evt.location}</p>
                    <Link to={`/events/${evt.id}`} className="btn btn-maroon btn-sm py-1 px-3">
                      {lang === 'ta' ? 'விவரங்கள்' : 'Event Details'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Highlights */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-gold fw-bold text-uppercase small">
              {lang === 'ta' ? 'நிர்வாகக் குழு' : 'Executive Governance'}
            </span>
            <h2 className="home-section-heading mx-auto">
              {lang === 'ta' ? 'இயக்கத்தின் முக்கிய நிர்வாகிகள்' : 'Executive Leadership'}
            </h2>
            <p className="text-muted small mx-auto" style={{ maxWidth: 540 }}>
              {lang === 'ta'
                ? 'மக்கள் தொண்டே மகேசன் தொண்டு எனும் உயரிய சிந்தனையுடன் இயங்கும் தலைமை நிர்வாகிகள்.'
                : 'Dedicated administrators serving regional units with transparency and accountability.'}
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {leadersList.map(leader => (
              <div className="col-lg-4 col-md-6" key={leader.id}>
                <div className="card-custom text-center p-4">
                  <img
                    src={leader.photo_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'}
                    alt={leader.name}
                    className="rounded-circle mb-3 border border-gold"
                    style={{ width: 110, height: 110, objectFit: 'cover' }}
                  />
                  <h5 className="h6 text-maroon fw-bold m-0">{leader.name}</h5>
                  <small className="text-gold d-block fw-semibold mb-2">{leader.designation}</small>
                  <p className="small text-muted mb-0">{leader.biography}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Join Membership Banner */}
      <section className="py-5 bg-maroon text-white text-center">
        <div className="container">
          <h2 className="h3 text-gold fw-bold mb-3">
            {lang === 'ta' ? 'இயக்கத்தில் உறுப்பினராக இணையுங்கள்!' : 'Ready to Join Our Movement?'}
          </h2>
          <p className="lead mx-auto mb-4" style={{ maxWidth: 650 }}>
            {lang === 'ta'
              ? 'பாதுகாக்கப்பட்ட QR டிஜிட்டல் அடையாள அட்டை பெற்று இயக்கத்தில் உறுப்பினராக இப்போதே இணையுங்கள்.'
              : 'Receive your verified Member ID, digital QR identification card, and active participation rights.'}
          </p>
          <Link to="/join" className="btn btn-gold btn-lg px-5 py-3 fw-bold">
            <i className="bi bi-person-plus-fill me-2"></i>
            {t('joinUs')}
          </Link>
        </div>
      </section>
    </div>
  );
};
