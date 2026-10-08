import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatTime, mediaUrl, pick } from '../services/apiClient';
import { useLanguage } from '../context/LanguageContext';

const PAGE_HERO_PHOTO = '/uploads/Gallery/IMG-20260925-WA0072.jpg';

export const PageHero: React.FC<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  icon?: string;
  children?: React.ReactNode;
}> = ({ eyebrow, title, subtitle, image = PAGE_HERO_PHOTO, icon, children }) => {
  const { t } = useLanguage();
  return (
    <section className="page-hero">
      <div className="page-hero-photo" style={{ backgroundImage: `url("${mediaUrl(image)}")` }} aria-hidden="true"></div>
      <div className="page-hero-glow" aria-hidden="true"></div>
      <div className="container page-hero-inner">
        <nav className="breadcrumb-lite" aria-label={t('ui.breadcrumbAria')}>
          <Link to="/"><i className="bi bi-house-door-fill"></i>{t('common.home')}</Link>
          <i className="bi bi-chevron-right"></i>
          <span>{title}</span>
        </nav>
        <div className="page-hero-heading">
          {icon && <span className="page-hero-icon"><i className={`bi ${icon}`}></i></span>}
          <div>
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            <h1>{title}</h1>
          </div>
        </div>
        {subtitle && <p>{subtitle}</p>}
        {children && <div className="page-hero-extra">{children}</div>}
      </div>
      <svg className="page-hero-wave" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,40 C240,80 480,0 720,24 C960,48 1200,70 1440,30 L1440,70 L0,70 Z" />
      </svg>
    </section>
  );
};

export const Loader: React.FC<{ label?: string }> = ({ label }) => {
  const { t } = useLanguage();
  return (
    <div className="state-box" role="status">
      <div className="spinner-border text-maroon"></div>
      <span>{label || t('common.loading')}</span>
    </div>
  );
};

export const EmptyState: React.FC<{ icon?: string; title: string; text?: string; children?: React.ReactNode }> = ({ icon = 'bi-inbox', title, text, children }) => (
  <div className="state-box">
    <i className={`bi ${icon} state-icon`}></i>
    <strong className="text-ink">{title}</strong>
    {text && <span className="small">{text}</span>}
    {children}
  </div>
);

export const ErrorBox: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => {
  const { t } = useLanguage();
  return (
    <div className="state-box">
      <i className="bi bi-wifi-off state-icon"></i>
      <span>{message}</span>
      {onRetry && (
        <button className="btn btn-sm btn-outline-maroon" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-1"></i>
          {t('common.tryAgain')}
        </button>
      )}
    </div>
  );
};

export const DateTile: React.FC<{ date: string }> = ({ date }) => {
  const { lang } = useLanguage();
  const d = new Date(`${date.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return (
    <div className="date-tile" aria-hidden="true">
      <span className="dt-month">{d.toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN', { month: 'short' })}</span>
      <span className="dt-day">{d.getDate()}</span>
      <span className="dt-year">{d.getFullYear()}</span>
    </div>
  );
};

export interface NewsItem {
  id: number;
  category: string;
  title: string;
  title_ta?: string | null;
  summary: string;
  summary_ta?: string | null;
  content?: string;
  content_ta?: string | null;
  cover_image?: string | null;
  place?: string | null;
  place_ta?: string | null;
  news_date?: string | null;
  news_time?: string | null;
  is_featured?: number;
  published_at: string;
  author_name?: string | null;
}

function newsWhen(item: NewsItem, lang: 'ta' | 'en'): string {
  if (item.news_date) {
    const d = formatDate(item.news_date, lang);
    return item.news_time ? `${d} · ${formatTime(item.news_time)}` : d;
  }
  return formatDate(item.published_at, lang);
}

export const NewsCard: React.FC<{ item: NewsItem }> = ({ item }) => {
  const { lang, t } = useLanguage();
  const cover = mediaUrl(item.cover_image);
  const place = pick(item, 'place', lang);
  return (
    <Link to={`/news/${item.id}`} className="card-custom card-hover news-card">
      <div className="news-card-media">
        {cover ? <img src={cover} alt="" loading="lazy" /> : <div className="news-card-placeholder"><i className="bi bi-newspaper"></i></div>}
        <span className="chip">{item.category}</span>
      </div>
      <div className="news-card-body">
        <div className="news-card-date"><i className="bi bi-calendar3 me-1"></i>{newsWhen(item, lang)}</div>
        {place && <div className="news-card-place small text-muted mb-1"><i className="bi bi-geo-alt me-1"></i>{place}</div>}
        <h3 className="news-card-title">{pick(item, 'title', lang)}</h3>
        <p className="news-card-summary">{pick(item, 'summary', lang)}</p>
        <span className="read-more">
          {t('common.readMore')} <i className="bi bi-arrow-right"></i>
        </span>
      </div>
    </Link>
  );
};

export interface EventItem {
  id: number;
  title: string;
  title_ta?: string | null;
  description: string;
  description_ta?: string | null;
  location: string;
  venue_address?: string | null;
  event_date: string;
  start_time: string;
  end_time?: string | null;
  cover_image?: string | null;
  status: string;
  capacity?: number;
}

export interface EventStatusLabel {
  /** Translation key; render with `t(status.key)`. */
  key: string;
  cls: string;
}

export const EVENT_STATUS_LABEL: Record<string, EventStatusLabel> = {
  UPCOMING: { key: 'ui.eventStatus.upcoming', cls: '' },
  ONGOING: { key: 'ui.eventStatus.ongoing', cls: 'chip-success' },
  COMPLETED: { key: 'ui.eventStatus.completed', cls: 'chip-warning' },
  CANCELLED: { key: 'ui.eventStatus.cancelled', cls: 'chip-danger' },
};

export const EventCard: React.FC<{ item: EventItem }> = ({ item }) => {
  const { lang, t } = useLanguage();
  const status = EVENT_STATUS_LABEL[item.status];
  return (
    <Link to={`/events/${item.id}`} className="card-custom card-hover event-card">
      <DateTile date={item.event_date} />
      <div className="min-w-0 d-flex flex-column">
        {status && item.status !== 'UPCOMING' && <span className={`chip ${status.cls} align-self-start mb-2`}>{t(status.key)}</span>}
        <h3 className="h5 mb-2">{pick(item, 'title', lang)}</h3>
        <div className="event-meta mb-2">
          <span><i className="bi bi-clock"></i>{formatTime(item.start_time)}{item.end_time ? ` – ${formatTime(item.end_time)}` : ''}</span>
          <span><i className="bi bi-geo-alt"></i>{item.location}</span>
        </div>
        <span className="read-more mt-auto">
          {t('common.viewDetails')} <i className="bi bi-arrow-right"></i>
        </span>
      </div>
      {item.cover_image && <img className="event-card-cover" src={mediaUrl(item.cover_image)} alt="" loading="lazy" />}
    </Link>
  );
};

export const LeaderPhoto: React.FC<{ src?: string | null; name: string; size?: number }> = ({ src, name, size = 112 }) => {
  const url = mediaUrl(src);
  if (url) return <img src={url} alt={name} className="leader-photo" style={{ width: size, height: size }} loading="lazy" />;
  const words = name.replace(/^(mr|mrs|ms|dr|adv|thiru|thirumathi|selvi)\.?\s+/i, '').split(/\s+/).filter(Boolean);
  const main = words.find((w) => w.length > 2 && !w.endsWith('.')) || words[0] || '?';
  const initials = main[0].toUpperCase();
  return (
    <span className="leader-photo leader-initials" style={{ width: size, height: size }} aria-label={name}>
      {initials}
    </span>
  );
};
