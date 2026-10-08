import React from 'react';
import { Link } from 'react-router-dom';
import { CmsPage } from '../components/CmsPage';
import { useLanguage } from '../context/LanguageContext';

const TIER_ICONS = ['bi-bank', 'bi-geo-alt', 'bi-signpost-split', 'bi-house-heart'];

/** State → district → taluk → branch tiers. */
export const StructureTiers: React.FC = () => {
  const { t, tRaw } = useLanguage();
  const tiers = tRaw<{ title: string; text: string }[]>('structurePage.tiers') ?? [];
  return (
    <div className="row g-3 structure-tiers">
      {TIER_ICONS.map((icon, i) => (
        <div className="col-sm-6 col-lg-3" key={icon}>
          <div className="card-custom card-hover feature-tile text-center h-100">
            <div className={`feature-icon mx-auto ${i === 0 ? 'dark' : i === 1 ? '' : 'gold'}`}><i className={`bi ${icon}`}></i></div>
            <div className="small text-muted fw-bold mb-1">{t('structurePage.level', { level: i + 1 })}</div>
            <h3 className="h6">{tiers[i]?.title}</h3>
            <p className="small mb-0">{tiers[i]?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export const StructurePage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <CmsPage
      pageKey="structure"
      eyebrowKey="structurePage.eyebrow"
      fallbackTitleKey="structurePage.fallbackTitle"
    >
      <div className="mt-2">
        <StructureTiers />
      </div>
      <div className="text-center mt-4">
        <Link to="/leadership" className="btn btn-maroon">{t('structurePage.meetExecutives')}</Link>
      </div>
    </CmsPage>
  );
};
