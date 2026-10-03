import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { apiClient, errorMessage } from '../services/apiClient';
import { useLanguage } from '../context/LanguageContext';
import { EmptyState, ErrorBox, Loader, NewsCard, NewsItem, PageHero } from '../components/ui';

export const NewsPage: React.FC = () => {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(() => {
    setError(null);
    setItems(null);
    apiClient
      .get('/news', { params: query ? { search: query } : {} })
      .then((r) => setItems(r.data.data))
      .catch((err) => setError(errorMessage(err)));
  }, [query]);
  useEffect(load, [load]);

  const categories = useMemo(() => Array.from(new Set((items || []).map((n) => n.category))).sort(), [items]);
  const visible = (items || []).filter((n) => !category || n.category === category);

  return (
    <>
      <PageHero
        eyebrow={ta ? 'அதிகாரப்பூர்வ செய்திகள்' : 'Official updates'}
        title={ta ? 'செய்திகள் & அறிவிப்புகள்' : 'News & Announcements'}
        subtitle={ta ? 'இயக்கத்தின் சமீபத்திய அறிக்கைகள், அறிவிப்புகள் மற்றும் கள நிகழ்வுகள்.' : 'The latest statements, announcements and field reports from the movement.'}
      />
      <section className="page-body">
        <div className="container">
          <div className="d-flex flex-wrap gap-2 align-items-center mb-4">
            <div className="input-group" style={{ maxWidth: 380 }}>
              <span className="input-group-text"><i className="bi bi-search"></i></span>
              <input className="form-control" placeholder={ta ? 'செய்திகளைத் தேடுங்கள்' : 'Search news'} value={search} onChange={(e) => setSearch(e.target.value)} aria-label={ta ? 'தேடல்' : 'Search'} />
            </div>
            {categories.length > 1 && (
              <div className="d-flex flex-wrap gap-2">
                <button className={`btn btn-sm ${!category ? 'btn-maroon' : 'btn-outline-maroon'}`} onClick={() => setCategory('')}>{ta ? 'அனைத்தும்' : 'All'}</button>
                {categories.map((c) => (
                  <button key={c} className={`btn btn-sm ${category === c ? 'btn-maroon' : 'btn-outline-maroon'}`} onClick={() => setCategory(c)}>{c}</button>
                ))}
              </div>
            )}
          </div>

          {error ? (
            <ErrorBox message={error} onRetry={load} />
          ) : !items ? (
            <Loader />
          ) : visible.length === 0 ? (
            <EmptyState icon="bi-newspaper" title={query ? (ta ? 'பொருந்தும் செய்திகள் இல்லை' : 'No matching news') : (ta ? 'இன்னும் செய்திகள் இல்லை' : 'No news yet')} />
          ) : (
            <div className="row g-4">
              {visible.map((n) => (
                <div className="col-md-6 col-lg-4" key={n.id}><NewsCard item={n} /></div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
