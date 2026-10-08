import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection, PublicStats } from '../components/HeroSection/HeroSection';
import { EventCard, EventItem, LeaderPhoto, NewsCard, NewsItem } from '../components/ui';
import { FounderSection } from '../components/FounderSection';
import { apiClient, asArray, mediaUrl, pick } from '../services/apiClient';
import { useLanguage } from '../context/LanguageContext';

const BENEFIT_STYLES = [
  { icon: 'bi-person-vcard-fill', cls: '' },
  { icon: 'bi-shield-fill-check', cls: 'gold' },
  { icon: 'bi-diagram-3-fill', cls: 'dark' },
];

export const HomePage: React.FC = () => {
  const { lang, t, tRaw } = useLanguage();
  const [stats, setStats] = useState<PublicStats | null | undefined>(undefined);
  const [news, setNews] = useState<NewsItem[] | null>(null);
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [leaders, setLeaders] = useState<any[]>([]);

  const aboutPoints = tRaw<string[]>('homePage.aboutPoints') ?? [];
  const benefits = tRaw<{ title: string; text: string }[]>('homePage.benefits') ?? [];

  useEffect(() => {
    apiClient.get('/public-stats').then((r) => setStats(r.data.data ?? null)).catch(() => setStats(null));
    apiClient.get('/news', { params: { limit: 3 } }).then((r) => setNews(asArray(r.data.data).slice(0, 3))).catch(() => setNews([]));
    apiClient.get('/events', { params: { upcoming: true, limit: 3 } }).then((r) => setEvents(asArray(r.data.data).slice(0, 3))).catch(() => setEvents([]));
    apiClient.get('/leadership').then((r) => setLeaders(asArray(r.data.data).slice(0, 4))).catch(() => {});
  }, []);

  return (
    <>
      <HeroSection stats={stats} />

      <section className="section section-white">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="about-collage">
                <img src={mediaUrl('/uploads/IMG-20260925-WA0072.jpg')} alt={t('homePage.aboutImageAlt')} className="about-img-main" onError={(e) => ((e.target as HTMLImageElement).src = '/hero-banner.jpg')} />
                <div className="about-badge">
                  <img src="/logo.jpg" alt="" />
                  <div>
                    <strong>{t('homePage.badgeTitle')}</strong>
                    <span>{t('homePage.badgeValues')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="eyebrow">{t('homePage.aboutEyebrow')}</div>
              <h2 className="section-title">{t('homePage.aboutTitle')}</h2>
              <p className="section-lead mb-4">{t('homePage.aboutLead')}</p>
              <ul className="check-list mb-4">
                {aboutPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/about" className="btn btn-maroon">{t('common.learnMore')}<i className="bi bi-arrow-right ms-2"></i></Link>
                <Link to="/leadership" className="btn btn-outline-maroon">{t('homePage.districtExecutives')}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FounderSection showPoliciesLink />

      <section className="section section-cream">
        <div className="container">
          <div className="section-head centered">
            <div className="eyebrow">{t('homePage.benefitsEyebrow')}</div>
            <h2 className="section-title">{t('homePage.benefitsTitle')}</h2>
            <p className="section-lead">{t('homePage.benefitsLead')}</p>
          </div>
          <div className="row g-4">
            {BENEFIT_STYLES.map((f, i) => (
              <div className="col-md-4" key={f.icon}>
                <div className="card-custom card-hover feature-tile">
                  <div className={`feature-icon ${f.cls}`}><i className={`bi ${f.icon}`}></i></div>
                  <h3>{benefits[i]?.title}</h3>
                  <p>{benefits[i]?.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{t('homePage.newsEyebrow')}</div>
              <h2 className="section-title mb-0">{t('homePage.newsTitle')}</h2>
            </div>
            <Link to="/news" className="btn btn-outline-maroon btn-sm">{t('homePage.allNews')}<i className="bi bi-arrow-right ms-1"></i></Link>
          </div>
          {news && news.length === 0 ? (
            <p className="text-muted">{t('homePage.noNews')}</p>
          ) : (
            <div className="row g-4">
              {(news || []).map((n) => (
                <div className="col-md-6 col-lg-4" key={n.id}><NewsCard item={n} /></div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section-cream">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{t('homePage.eventsEyebrow')}</div>
              <h2 className="section-title mb-0">{t('homePage.eventsTitle')}</h2>
            </div>
            <Link to="/events" className="btn btn-outline-maroon btn-sm">{t('homePage.allEvents')}<i className="bi bi-arrow-right ms-1"></i></Link>
          </div>
          {events && events.length === 0 ? (
            <p className="text-muted">{t('homePage.noEvents')}</p>
          ) : (
            <div className="row g-4">
              {(events || []).map((e) => (
                <div className="col-lg-4 col-md-6" key={e.id}><EventCard item={e} /></div>
              ))}
            </div>
          )}
        </div>
      </section>

      {leaders.length > 0 && (
        <section className="section section-white">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">{t('homePage.leadershipEyebrow')}</div>
                <h2 className="section-title mb-0">{t('homePage.districtExecutives')}</h2>
              </div>
              <Link to="/leadership" className="btn btn-outline-maroon btn-sm">{t('common.viewAll')}<i className="bi bi-arrow-right ms-1"></i></Link>
            </div>
            <div className="row g-4">
              {leaders.map((l) => (
                <div className="col-6 col-lg-3" key={l.id}>
                  <div className="card-custom card-hover leader-card">
                    <LeaderPhoto src={l.photo_url} name={l.name} size={96} />
                    <h3 className="leader-name">{pick(l, 'name', lang)}</h3>
                    <div className="leader-role">{pick(l, 'designation', lang)}</div>
                    {l.district && <div className="small text-muted mt-1"><i className="bi bi-geo-alt me-1"></i>{pick(l, 'district', lang)}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-sm section-white pt-0">
        <div className="container">
          <div className="cta-band">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <h2 className="mb-2">{t('homePage.ctaTitle')}</h2>
                <p className="mb-0">{t('homePage.ctaText')}</p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link to="/join" className="btn btn-gold btn-lg">
                  <i className="bi bi-person-plus-fill me-2"></i>{t('common.registerNow')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
