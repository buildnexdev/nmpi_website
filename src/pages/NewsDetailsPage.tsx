import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiClient, errorMessage, formatDate, mediaUrl, pick } from '../services/apiClient';
import { useLanguage } from '../context/LanguageContext';
import { EmptyState, Loader, NewsCard, NewsItem } from '../components/ui';

export const NewsDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const [item, setItem] = useState<NewsItem | null>(null);
  const [related, setRelated] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setItem(null);
    setError(null);
    apiClient
      .get(`/news/${id}`)
      .then((r) => setItem(r.data.data))
      .catch((err) => setError(err.response?.status === 404 ? 'NOT_FOUND' : errorMessage(err)));
    apiClient.get('/news', { params: { limit: 4 } }).then((r) => setRelated(r.data.data.filter((n: NewsItem) => String(n.id) !== id).slice(0, 3))).catch(() => {});
  }, [id]);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: item ? pick(item, 'title', lang) : 'NMPI', url }).catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="container page-body">
        <EmptyState icon="bi-newspaper" title={error === 'NOT_FOUND' ? (ta ? 'செய்தி கிடைக்கவில்லை' : 'Article not found') : error}>
          <Link to="/news" className="btn btn-maroon btn-sm mt-2">{ta ? 'அனைத்து செய்திகளும்' : 'Back to news'}</Link>
        </EmptyState>
      </div>
    );
  }
  if (!item) return <div className="container page-body"><Loader /></div>;

  const cover = mediaUrl(item.cover_image);

  return (
    <>
      <article>
        <header className="page-hero" style={cover ? ({ '--page-hero-image': `url(${cover})` } as React.CSSProperties) : undefined}>
          <div className="container position-relative" style={{ zIndex: 1, maxWidth: 900 }}>
            <nav className="breadcrumb-lite mb-3">
              <Link to="/">{ta ? 'முகப்பு' : 'Home'}</Link><span>/</span><Link to="/news">{ta ? 'செய்திகள்' : 'News'}</Link>
            </nav>
            <span className="chip mb-3" style={{ background: 'var(--accent-gold)', color: 'var(--ink)' }}>{item.category}</span>
            <h1>{pick(item, 'title', lang)}</h1>
            <p className="d-flex flex-wrap gap-3 small">
              <span><i className="bi bi-calendar3 me-1"></i>{formatDate(item.published_at, lang)}</span>
              {item.author_name && <span><i className="bi bi-person me-1"></i>{item.author_name}</span>}
            </p>
          </div>
        </header>
        <div className="page-body">
          <div className="container" style={{ maxWidth: 900 }}>
            <div className="card-custom p-4 p-md-5">
              {cover && <img src={cover} alt="" className="w-100 rounded-4 mb-4" style={{ maxHeight: 480, objectFit: 'cover' }} />}
              <p className="lead fw-semibold text-ink">{pick(item, 'summary', lang)}</p>
              <div className="rich-text" dangerouslySetInnerHTML={{ __html: pick(item, 'content', lang) }} />
              <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center border-top pt-4 mt-4">
                <Link to="/news" className="btn btn-outline-maroon btn-sm"><i className="bi bi-arrow-left me-1"></i>{ta ? 'அனைத்து செய்திகளும்' : 'All news'}</Link>
                <button className="btn btn-maroon btn-sm" onClick={share}>
                  <i className={`bi ${copied ? 'bi-check2' : 'bi-share'} me-1`}></i>
                  {copied ? (ta ? 'இணைப்பு நகலெடுக்கப்பட்டது' : 'Link copied') : ta ? 'பகிர்' : 'Share'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section-sm section-white">
          <div className="container">
            <h2 className="h4 mb-4">{ta ? 'மேலும் செய்திகள்' : 'More news'}</h2>
            <div className="row g-4">
              {related.map((n) => (
                <div className="col-md-4" key={n.id}><NewsCard item={n} /></div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};
