import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { apiClient, asArray, errorMessage } from '../services/apiClient';
import { useLanguage } from '../context/LanguageContext';
import { EmptyState, ErrorBox, Loader, NewsCard, NewsItem, PageHero } from '../components/ui';

export const NewsPage: React.FC = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(() => {
    setError(null);
    setItems(null);
    apiClient
      .get('/news', { params: query ? { search: query } : {} })
      .then((r) => setItems(asArray(r.data.data)))
      .catch((err) => setError(errorMessage(err)));
  }, [query]);
  useEffect(load, [load]);

  const categories = useMemo(() => Array.from(new Set((items || []).map((n) => n.category))).sort(), [items]);
  const visible = (items || []).filter((n) => !category || n.category === category);

  return (
    <>
      <PageHero
        eyebrow={t('newsPage.eyebrow')}
        title={t('newsPage.title')}
        subtitle={t('newsPage.subtitle')}
      />
      <section className="page-body">
        <div className="container">
          <div className="d-flex flex-wrap gap-2 align-items-center mb-4">
            <div className="input-group" style={{ maxWidth: 380 }}>
              <span className="input-group-text"><i className="bi bi-search"></i></span>
              <input className="form-control" placeholder={t('newsPage.searchPlaceholder')} value={search} onChange={(e) => setSearch(e.target.value)} aria-label={t('newsPage.searchAria')} />
            </div>
            {categories.length > 1 && (
              <div className="d-flex flex-wrap gap-2">
                <button className={`btn btn-sm ${!category ? 'btn-maroon' : 'btn-outline-maroon'}`} onClick={() => setCategory('')}>{t('newsPage.allCategories')}</button>
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
            <EmptyState icon="bi-newspaper" title={query ? t('newsPage.emptyNoMatch') : t('newsPage.emptyNoNews')} />
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
