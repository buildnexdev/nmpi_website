import React, { useCallback, useEffect, useState } from 'react';
import { apiClient, asArray, errorMessage, mediaUrl } from '../services/apiClient';
import { useLanguage } from '../context/LanguageContext';
import { EmptyState, ErrorBox, Loader, PageHero } from '../components/ui';

interface UploadImage {
  filename: string;
  path: string;
  updated_at: string;
}

export const GalleryPage: React.FC = () => {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const [images, setImages] = useState<UploadImage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<number | null>(null);

  const load = useCallback(() => {
    setError(null);
    apiClient
      .get('/uploads/list')
      .then((res) => setImages(asArray<UploadImage>(res.data.data).filter((img) => !/logo/i.test(img.filename))))
      .catch((err) => setError(errorMessage(err)));
  }, []);
  useEffect(load, [load]);

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
        eyebrow={ta ? 'ஊடகம்' : 'Media'}
        title={ta ? 'புகைப்படத் தொகுப்பு' : 'Photo Gallery'}
        subtitle={ta ? 'கள நிகழ்வுகள், பொதுக் கூட்டங்கள் மற்றும் சமூக சேவைப் பணிகளின் தருணங்கள்.' : 'Moments from field programmes, public meetings and community service.'}
      />
      <section className="page-body">
        <div className="container">
          {error ? (
            <ErrorBox message={error} onRetry={load} />
          ) : !images ? (
            <Loader />
          ) : images.length === 0 ? (
            <EmptyState icon="bi-images" title={ta ? 'புகைப்படங்கள் இன்னும் இல்லை' : 'No photos yet'} />
          ) : (
            <div className="gallery-grid">
              {images.map((img, idx) => (
                <button type="button" className="gallery-item border-0 p-0 w-100 bg-transparent" key={img.filename} onClick={() => setActive(idx)} aria-label={`${ta ? 'படத்தைத் திற' : 'Open photo'} ${idx + 1}`}>
                  <img src={mediaUrl(img.path)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={ta ? 'புகைப்படம்' : 'Photo viewer'} onClick={() => setActive(null)}>
          <img src={mediaUrl(current.path)} alt="" onClick={(e) => e.stopPropagation()} />
          <button type="button" className="lightbox-btn" style={{ top: 20, right: 20 }} onClick={() => setActive(null)} aria-label="Close" autoFocus>
            <i className="bi bi-x-lg"></i>
          </button>
          {count > 1 && (
            <>
              <button type="button" className="lightbox-btn" style={{ left: 20, top: '50%', transform: 'translateY(-50%)' }} onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous">
                <i className="bi bi-chevron-left"></i>
              </button>
              <button type="button" className="lightbox-btn" style={{ right: 20, top: '50%', transform: 'translateY(-50%)' }} onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next">
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
