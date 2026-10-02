import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection/HeroSection';
import { NewsCard } from '../components/NewsCard/NewsCard';
import { apiClient } from '../services/apiClient';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [leadersList, setLeadersList] = useState<any[]>([]);

  useEffect(() => {
    // Fetch live data from backend API
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
              <span className="text-gold fw-bold text-uppercase small">Official Bulletins</span>
              <h2 className="home-section-heading m-0">Latest News & Announcements</h2>
            </div>
            <Link to="/news" className="btn btn-outline-danger btn-sm">
              View All News <i className="bi bi-arrow-right ms-1"></i>
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
              <span className="text-gold fw-bold text-uppercase small">Community Calendar</span>
              <h2 className="home-section-heading m-0">Upcoming Events & Gatherings</h2>
            </div>
            <Link to="/events" className="btn btn-outline-danger btn-sm">
              View Event Calendar <i className="bi bi-arrow-right ms-1"></i>
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
                      Event Details
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
            <span className="text-gold fw-bold text-uppercase small">Governance</span>
            <h2 className="home-section-heading mx-auto">Executive Leadership</h2>
            <p className="text-muted small mx-auto" style={{ maxWidth: 540 }}>
              Guided by dedicated administrators serving regional units with transparency and accountability.
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
          <h2 className="h3 text-gold fw-bold mb-3">Ready to Join Our Community Network?</h2>
          <p className="lead mx-auto mb-4" style={{ maxWidth: 650 }}>
            Receive your verified Member ID, digital QR identification card, and active voting participation rights in assembly affairs.
          </p>
          <Link to="/join" className="btn btn-gold btn-lg px-5 py-3">
            Start Membership Application
          </Link>
        </div>
      </section>
    </div>
  );
};
