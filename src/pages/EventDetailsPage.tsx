import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiClient, errorMessage, formatDate, formatTime, mediaUrl, pick } from '../services/apiClient';
import { useLanguage } from '../context/LanguageContext';
import { DateTile, EVENT_STATUS_LABEL, EmptyState, EventItem, Loader } from '../components/ui';

function toCalendarStamp(date: string, time?: string | null) {
  return `${date.replace(/-/g, '')}T${(time || '10:00').slice(0, 5).replace(':', '')}00`;
}

export const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const [item, setItem] = useState<EventItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItem(null);
    setError(null);
    apiClient
      .get(`/events/${id}`)
      .then((r) => setItem(r.data.data))
      .catch((err) => setError(err.response?.status === 404 ? 'NOT_FOUND' : errorMessage(err)));
  }, [id]);

  if (error) {
    return (
      <div className="container page-body">
        <EmptyState icon="bi-calendar-x" title={error === 'NOT_FOUND' ? (ta ? 'நிகழ்வு கிடைக்கவில்லை' : 'Event not found') : error}>
          <Link to="/events" className="btn btn-maroon btn-sm mt-2">{ta ? 'அனைத்து நிகழ்வுகளும்' : 'Back to events'}</Link>
        </EmptyState>
      </div>
    );
  }
  if (!item) return <div className="container page-body"><Loader /></div>;

  const cover = mediaUrl(item.cover_image);
  const status = EVENT_STATUS_LABEL[item.status];
  const place = [item.location, item.venue_address].filter(Boolean).join(', ');
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
  const calendarUrl =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(item.title)}` +
    `&dates=${toCalendarStamp(item.event_date, item.start_time)}/${toCalendarStamp(item.event_date, item.end_time || item.start_time)}` +
    `&location=${encodeURIComponent(place)}` +
    `&details=${encodeURIComponent(item.description)}`;

  return (
    <>
      <header className="page-hero" style={cover ? ({ '--page-hero-image': `url(${cover})` } as React.CSSProperties) : undefined}>
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <nav className="breadcrumb-lite mb-3">
            <Link to="/">{ta ? 'முகப்பு' : 'Home'}</Link><span>/</span><Link to="/events">{ta ? 'நிகழ்வுகள்' : 'Events'}</Link>
          </nav>
          {status && <span className="chip mb-3" style={{ background: 'var(--accent-gold)', color: 'var(--ink)' }}>{status[lang]}</span>}
          <h1>{pick(item, 'title', lang)}</h1>
          <p><i className="bi bi-geo-alt me-1"></i>{item.location}</p>
        </div>
      </header>

      <section className="page-body">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card-custom p-4 p-md-5">
                {cover && <img src={cover} alt="" className="w-100 rounded-4 mb-4" style={{ maxHeight: 440, objectFit: 'cover' }} />}
                <h2 className="h4 mb-3">{ta ? 'நிகழ்வு பற்றி' : 'About this event'}</h2>
                <div className="rich-text" style={{ whiteSpace: 'pre-line' }}>{pick(item, 'description', lang)}</div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card-custom p-4 position-sticky" style={{ top: 'calc(var(--header-h) + 52px)' }}>
                <div className="d-flex gap-3 align-items-center mb-4">
                  <DateTile date={item.event_date} />
                  <div>
                    <div className="fw-bold text-ink">{formatDate(item.event_date, lang)}</div>
                    <div className="text-muted small">
                      {formatTime(item.start_time)}{item.end_time ? ` – ${formatTime(item.end_time)}` : ''}
                    </div>
                  </div>
                </div>
                <ul className="list-unstyled event-meta flex-column gap-3 mb-4">
                  <li><i className="bi bi-geo-alt"></i><strong className="text-ink">{item.location}</strong>{item.venue_address && <div className="ms-4">{item.venue_address}</div>}</li>
                  {item.capacity ? <li><i className="bi bi-people"></i>{ta ? `${item.capacity} பேர் வரை` : `Up to ${item.capacity} people`}</li> : null}
                </ul>
                <div className="d-grid gap-2">
                  {item.status !== 'CANCELLED' && item.status !== 'COMPLETED' && (
                    <a href={calendarUrl} target="_blank" rel="noreferrer" className="btn btn-maroon">
                      <i className="bi bi-calendar-plus me-2"></i>{ta ? 'நாட்காட்டியில் சேர்' : 'Add to calendar'}
                    </a>
                  )}
                  <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn btn-outline-maroon">
                    <i className="bi bi-map me-2"></i>{ta ? 'வரைபடத்தில் காண்க' : 'Open in Maps'}
                  </a>
                  <Link to="/events" className="btn btn-link text-decoration-none">{ta ? '← அனைத்து நிகழ்வுகளும்' : '← All events'}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
