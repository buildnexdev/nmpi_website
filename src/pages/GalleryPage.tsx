import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { apiClient, asArray, errorMessage, mediaUrl } from '../services/apiClient';
import { useLanguage } from '../context/LanguageContext';
import { EmptyState, ErrorBox, Loader, PageHero } from '../components/ui';

interface UploadImage {
  filename: string;
  folder: string;
  path: string;
  updated_at: string;
}

/** Loose files in uploads/ come back as "General"; on the website they count as photos. */
const FILTERS: { folder: string; labelKey: string }[] = [
  { folder: '', labelKey: 'galleryPage.all' },
  { folder: 'Gallery', labelKey: 'galleryPage.photos' },
  { folder: 'Events', labelKey: 'nav.events' },
  { folder: 'News', labelKey: 'header.nav.news' },
];
const groupOf = (img: UploadImage) => (img.folder === 'General' ? 'Gallery' : img.folder);

export const GalleryPage: React.FC = () => {
  const { t } = useLanguage();
  const [all, setAll] = useState<UploadImage[] | null>(null);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<number | null>(null);

  const load = useCallback(() => {
    setError(null);
    apiClient
      .get('/uploads/list', { params: { folder: 'Gallery,Events,News,General' } })
      .then((res) => setAll(asArray<UploadImage>(res.data.data).filter((img) => !/logo/i.test(img.filename))))
      .catch((err) => setError(errorMessage(err)));
  }, []);
  useEffect(load, [load]);

  const images = useMemo(() => (all ? all.filter((img) => !filter || groupOf(img) === filter) : null), [all, filter]);
  const count = images?.length || 0;
  const step = useCallback((delta: number) => setActive((i) => (i === null ? i : (i + delta + count) % count)), [count]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active, step]);

  const current = active !== null && images ? images[active] : null;

  return (
    <>
      <PageHero
        eyebrow={t('galleryPage.eyebrow')}
        title={t('galleryPage.title')}
        subtitle={t('galleryPage.subtitle')}
      />
      <section className="page-body">
        <div className="container">
          {all && all.length > 0 && (
            <div className="gallery-filters" role="group" aria-label={t('galleryPage.title')}>
              {FILTERS.map((f) => {
                const n = f.folder ? all.filter((img) => groupOf(img) === f.folder).length : all.length;
                return (
                  <button
                    key={f.folder || 'all'}
                    type="button"
                    aria-pressed={filter === f.folder}
                    className={`gallery-filter ${filter === f.folder ? 'active' : ''}`}
                    onClick={() => { setFilter(f.folder); setActive(null); }}
                  >
                    {t(f.labelKey)} <span>{n}</span>
                  </button>
                );
              })}
            </div>
          )}
          {error ? (
            <ErrorBox message={error} onRetry={load} />
          ) : !images ? (
            <Loader />
          ) : images.length === 0 ? (
            <EmptyState icon="bi-images" title={t('galleryPage.emptyTitle')} />
          ) : (
            <div className="gallery-grid">
              {images.map((img, idx) => (
                <button type="button" className="gallery-item border-0 p-0 w-100 bg-transparent" key={img.path} onClick={() => setActive(idx)} aria-label={t('galleryPage.openPhotoAria', { number: idx + 1 })}>
                  <img src={mediaUrl(img.path)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={t('galleryPage.viewerAria')} onClick={() => setActive(null)}>
          <img src={mediaUrl(current.path)} alt="" onClick={(e) => e.stopPropagation()} />
          <button type="button" className="lightbox-btn" style={{ top: 20, right: 20 }} onClick={() => setActive(null)} aria-label={t('common.close')} autoFocus>
            <i className="bi bi-x-lg"></i>
          </button>
          {count > 1 && (
            <>
              <button type="button" className="lightbox-btn" style={{ left: 20, top: '50%', transform: 'translateY(-50%)' }} onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label={t('galleryPage.previousAria')}>
                <i className="bi bi-chevron-left"></i>
              </button>
              <button type="button" className="lightbox-btn" style={{ right: 20, top: '50%', transform: 'translateY(-50%)' }} onClick={(e) => { e.stopPropagation(); step(1); }} aria-label={t('galleryPage.nextAria')}>
                <i className="bi bi-chevron-right"></i>
              </button>
            </>
          )}
          <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 small text-white-50">
            {active! + 1} / {count}
          </div>
        </div>
      )}
    </>
  );
};
