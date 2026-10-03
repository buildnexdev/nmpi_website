import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatTime, mediaUrl, pick } from '../services/apiClient';
import { useLanguage } from '../context/LanguageContext';

export const PageHero: React.FC<{ eyebrow?: string; title: string; subtitle?: string; image?: string; children?: React.ReactNode }> = ({
  eyebrow,
  title,
  subtitle,
  image,
  children,
}) => {
  const { lang } = useLanguage();
  return (
    <section className="page-hero" style={image ? ({ '--page-hero-image': `url(${image})` } as React.CSSProperties) : undefined}>
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <nav className="breadcrumb-lite mb-3" aria-label="Breadcrumb">
          <Link to="/">{lang === 'ta' ? 'முகப்பு' : 'Home'}</Link>
          <span>/</span>
          <span>{title}</span>
        </nav>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children}
      </div>
    </section>
  );
};

export const Loader: React.FC<{ label?: string }> = ({ label }) => {
  const { lang } = useLanguage();
  return (
    <div className="state-box" role="status">
      <div className="spinner-border text-maroon"></div>
      <span>{label || (lang === 'ta' ? 'ஏற்றுகிறது...' : 'Loading...')}</span>
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
  const { lang } = useLanguage();
  return (
    <div className="state-box">
      <i className="bi bi-wifi-off state-icon"></i>
      <span>{message}</span>
      {onRetry && (
        <button className="btn btn-sm btn-outline-maroon" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-1"></i>
          {lang === 'ta' ? 'மீண்டும் முயற்சிக்கவும்' : 'Try again'}
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
  is_featured?: number;
  published_at: string;
  author_name?: string | null;
}

export const NewsCard: React.FC<{ item: NewsItem }> = ({ item }) => {
  const { lang } = useLanguage();
  const cover = mediaUrl(item.cover_image);
  return (
    <Link to={`/news/${item.id}`} className="card-custom card-hover news-card">
      <div className="news-card-media">
        {cover ? <img src={cover} alt="" loading="lazy" /> : <div className="news-card-placeholder"><i className="bi bi-newspaper"></i></div>}
        <span className="chip">{item.category}</span>
      </div>
      <div className="news-card-body">
        <div className="news-card-date"><i className="bi bi-calendar3 me-1"></i>{formatDate(item.published_at, lang)}</div>
        <h3 className="news-card-title">{pick(item, 'title', lang)}</h3>
        <p className="news-card-summary">{pick(item, 'summary', lang)}</p>
        <span className="read-more">
          {lang === 'ta' ? 'மேலும் படிக்க' : 'Read more'} <i className="bi bi-arrow-right"></i>
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

export const EVENT_STATUS_LABEL: Record<string, { ta: string; en: string; cls: string }> = {
  UPCOMING: { ta: 'வரவிருக்கிறது', en: 'Upcoming', cls: '' },
  ONGOING: { ta: 'நடைபெறுகிறது', en: 'Happening now', cls: 'chip-success' },
  COMPLETED: { ta: 'நிறைவடைந்தது', en: 'Completed', cls: 'chip-warning' },
  CANCELLED: { ta: 'ரத்து செய்யப்பட்டது', en: 'Cancelled', cls: 'chip-danger' },
};

export const EventCard: React.FC<{ item: EventItem }> = ({ item }) => {
  const { lang } = useLanguage();
  const status = EVENT_STATUS_LABEL[item.status];
  return (
    <Link to={`/events/${item.id}`} className="card-custom card-hover event-card">
      <DateTile date={item.event_date} />
      <div className="min-w-0 d-flex flex-column">
        {status && item.status !== 'UPCOMING' && <span className={`chip ${status.cls} align-self-start mb-2`}>{status[lang]}</span>}
        <h3 className="h5 mb-2">{pick(item, 'title', lang)}</h3>
        <div className="event-meta mb-2">
          <span><i className="bi bi-clock"></i>{formatTime(item.start_time)}{item.end_time ? ` – ${formatTime(item.end_time)}` : ''}</span>
          <span><i className="bi bi-geo-alt"></i>{item.location}</span>
        </div>
        <span className="read-more mt-auto">
          {lang === 'ta' ? 'விவரங்கள்' : 'View details'} <i className="bi bi-arrow-right"></i>
        </span>
      </div>
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
