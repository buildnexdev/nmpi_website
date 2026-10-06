import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection, PublicStats } from '../components/HeroSection/HeroSection';
import { EventCard, EventItem, LeaderPhoto, NewsCard, NewsItem } from '../components/ui';
import { apiClient, asArray, mediaUrl, pick } from '../services/apiClient';
import { useLanguage } from '../context/LanguageContext';

export const HomePage: React.FC = () => {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [news, setNews] = useState<NewsItem[] | null>(null);
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/public-stats').then((r) => setStats(r.data.data)).catch(() => {});
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
                <img src={mediaUrl('/uploads/IMG-20260925-WA0072.jpg')} alt={ta ? 'இயக்க மாநில பொதுக்குழு' : 'State general council'} className="about-img-main" onError={(e) => ((e.target as HTMLImageElement).src = '/hero-banner.jpg')} />
                <div className="about-badge">
                  <img src="/logo.jpg" alt="" />
                  <div>
                    <strong>{ta ? 'நேதாஜி வழியில்' : 'In the path of Netaji'}</strong>
                    <span>{ta ? 'ஒழுக்கம் · சேவை · தியாகம்' : 'Discipline · Service · Sacrifice'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="eyebrow">{ta ? 'இயக்கம் பற்றி' : 'Who we are'}</div>
              <h2 className="section-title">
                {ta ? 'மக்களின் உரிமைகளுக்காக ஒன்றிணைந்த இயக்கம்' : "United for every citizen's rights and safety"}
              </h2>
              <p className="section-lead mb-4">
                {ta
                  ? 'நேதாஜி மக்கள் பாதுகாப்பு இயக்கம் தமிழகத்தின் அனைத்து மாவட்டங்களிலும் மக்களின் வாழ்வாதாரம், பாதுகாப்பு மற்றும் சமூக நீதிக்காக களப்பணியாற்றி வருகிறது.'
                  : 'Netaji Makkal Pathukappu Iyakkam works on the ground in every district of Tamil Nadu for livelihoods, public safety and social justice.'}
              </p>
              <ul className="check-list mb-4">
                <li>{ta ? 'அனைத்து மாவட்டங்களிலும் நிர்வாகிகள் கட்டமைப்பு' : 'Structured leadership in every district'}</li>
                <li>{ta ? 'சட்ட உதவி மற்றும் உரிமை பாதுகாப்பு' : 'Legal aid and rights protection'}</li>
                <li>{ta ? 'QR சரிபார்ப்புடன் கூடிய டிஜிட்டல் அடையாள அட்டை' : 'Digital ID card with QR verification'}</li>
              </ul>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/about" className="btn btn-maroon">{ta ? 'மேலும் அறிய' : 'Learn more'}<i className="bi bi-arrow-right ms-2"></i></Link>
                <Link to="/leadership" className="btn btn-outline-maroon">{ta ? 'மாவட்ட நிர்வாகிகள்' : 'District executives'}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-cream">
        <div className="container">
          <div className="section-head centered">
            <div className="eyebrow">{ta ? 'உறுப்பினர் நன்மைகள்' : 'Member benefits'}</div>
            <h2 className="section-title">{ta ? 'ஏன் இயக்கத்தில் இணைய வேண்டும்?' : 'Why join the movement?'}</h2>
            <p className="section-lead">
              {ta ? 'உறுப்பினர் சேர்க்கை முற்றிலும் இலவசம். பதிவு செய்தவுடன் உங்கள் டிஜிட்டல் அடையாள அட்டை உடனடியாக கிடைக்கும்.' : 'Membership is free. Your digital ID card is issued the moment you register.'}
            </p>
          </div>
          <div className="row g-4">
            {[
              { icon: 'bi-person-vcard-fill', cls: '', ta: ['டிஜிட்டல் அடையாள அட்டை', 'உறுப்பினர் எண் மற்றும் QR சரிபார்ப்புடன் கூடிய அதிகாரப்பூர்வ அடையாள அட்டை — மொபைல் செயலியிலும் கிடைக்கும்.'], en: ['Digital ID card', 'An official member card with a unique ID and QR verification — also available in the mobile app.'] },
              { icon: 'bi-shield-fill-check', cls: 'gold', ta: ['சட்ட உதவி & பாதுகாப்பு', 'இயக்கத்தின் வழக்கறிஞரணி மூலம் உறுப்பினர்களின் உரிமைகளுக்கு ஆதரவு.'], en: ['Legal aid & protection', "Support for members' rights through the movement's legal wing."] },
              { icon: 'bi-diagram-3-fill', cls: 'dark', ta: ['மாவட்ட வலையமைப்பு', 'உங்கள் மாவட்ட, தாலுகா மற்றும் கிளை நிர்வாகிகளுடன் நேரடி தொடர்பு.'], en: ['District network', 'Connect directly with your district, taluk and unit coordinators.'] },
            ].map((f) => (
              <div className="col-md-4" key={f.icon}>
                <div className="card-custom card-hover feature-tile">
                  <div className={`feature-icon ${f.cls}`}><i className={`bi ${f.icon}`}></i></div>
                  <h3>{ta ? f.ta[0] : f.en[0]}</h3>
                  <p>{ta ? f.ta[1] : f.en[1]}</p>
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
              <div className="eyebrow">{ta ? 'அதிகாரப்பூர்வ செய்திகள்' : 'Latest updates'}</div>
              <h2 className="section-title mb-0">{ta ? 'இயக்கச் செய்திகள்' : 'News & announcements'}</h2>
            </div>
            <Link to="/news" className="btn btn-outline-maroon btn-sm">{ta ? 'அனைத்து செய்திகளும்' : 'All news'}<i className="bi bi-arrow-right ms-1"></i></Link>
          </div>
          {news && news.length === 0 ? (
            <p className="text-muted">{ta ? 'விரைவில் செய்திகள் வெளியிடப்படும்.' : 'News will be published here soon.'}</p>
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
              <div className="eyebrow">{ta ? 'நிகழ்ச்சி நிரல்' : 'Calendar'}</div>
              <h2 className="section-title mb-0">{ta ? 'வரவிருக்கும் நிகழ்வுகள்' : 'Upcoming events'}</h2>
            </div>
            <Link to="/events" className="btn btn-outline-maroon btn-sm">{ta ? 'அனைத்து நிகழ்வுகளும்' : 'All events'}<i className="bi bi-arrow-right ms-1"></i></Link>
          </div>
          {events && events.length === 0 ? (
            <p className="text-muted">{ta ? 'தற்போது வரவிருக்கும் நிகழ்வுகள் இல்லை.' : 'No upcoming events right now — check back soon.'}</p>
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
                <div className="eyebrow">{ta ? 'தலைமை' : 'Leadership'}</div>
                <h2 className="section-title mb-0">{ta ? 'மாவட்ட நிர்வாகிகள்' : 'District executives'}</h2>
              </div>
              <Link to="/leadership" className="btn btn-outline-maroon btn-sm">{ta ? 'அனைவரையும் காண்க' : 'View all'}<i className="bi bi-arrow-right ms-1"></i></Link>
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
                <h2 className="mb-2">{ta ? 'இன்றே இயக்கத்தில் உறுப்பினராக இணையுங்கள்' : 'Join the movement today'}</h2>
                <p className="mb-0">
                  {ta ? 'இலவச பதிவு · உடனடி உறுப்பினர் எண் · QR சரிபார்ப்புடன் கூடிய டிஜிட்டல் அடையாள அட்டை' : 'Free registration · Instant member number · Digital ID card with QR verification'}
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link to="/join" className="btn btn-gold btn-lg">
                  <i className="bi bi-person-plus-fill me-2"></i>{ta ? 'இப்போதே இணையுங்கள்' : 'Register now'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
