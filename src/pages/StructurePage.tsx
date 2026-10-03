import React from 'react';
import { Link } from 'react-router-dom';
import { CmsPage } from '../components/CmsPage';
import { useLanguage } from '../context/LanguageContext';

const TIERS = [
  { icon: 'bi-bank', ta: ['மாநில தலைமை', 'மாநில செயற்குழு மற்றும் பொதுக்குழு'], en: ['State leadership', 'State executive and general council'] },
  { icon: 'bi-geo-alt', ta: ['மாவட்டம்', 'மாவட்டச் செயலாளர் மற்றும் ஒருங்கிணைப்பாளர்கள்'], en: ['District', 'District secretary and coordinators'] },
  { icon: 'bi-signpost-split', ta: ['தாலுகா / ஒன்றியம்', 'தாலுகா ஒருங்கிணைப்பாளர்கள்'], en: ['Taluk / Block', 'Taluk coordinators'] },
  { icon: 'bi-house-heart', ta: ['கிளை', 'கிராம / வார்டு அளவிலான பிரதிநிதிகள்'], en: ['Unit', 'Village and ward representatives'] },
];

export const StructurePage: React.FC = () => {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  return (
    <CmsPage
      pageKey="structure"
      eyebrow={{ ta: 'அமைப்பு', en: 'Organisation' }}
      fallbackTitle={{ ta: 'அமைப்பு கட்டமைப்பு', en: 'Organisational Structure' }}
    >
      <div className="row g-3 mt-2">
        {TIERS.map((t, i) => (
          <div className="col-sm-6 col-lg-3" key={t.icon}>
            <div className="card-custom feature-tile text-center">
              <div className={`feature-icon mx-auto ${i === 0 ? 'dark' : i === 1 ? '' : 'gold'}`}><i className={`bi ${t.icon}`}></i></div>
              <div className="small text-muted fw-bold mb-1">{ta ? `நிலை ${i + 1}` : `Level ${i + 1}`}</div>
              <h3 className="h6">{ta ? t.ta[0] : t.en[0]}</h3>
              <p className="small">{ta ? t.ta[1] : t.en[1]}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <Link to="/leadership" className="btn btn-maroon">{ta ? 'மாவட்ட நிர்வாகிகளைக் காண்க' : 'Meet the district executives'}</Link>
      </div>
    </CmsPage>
  );
};
