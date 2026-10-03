import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const ActionsPage: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <div className="container py-5">
      <div className="card-custom p-4 p-md-5">
        <h1 className="text-maroon fw-bold h2 mb-4">
          {lang === 'ta' ? 'இயக்கத்தின் செயல்பாடுகள்' : 'Actions & Community Initiatives'}
        </h1>
        <ul className="list-group list-group-flush small">
          <li className="list-group-item py-3">
            <h5 className="h6 text-maroon font-bold mb-1"><i className="bi bi-check-circle-fill text-gold me-2"></i>{lang === 'ta' ? 'உறுப்பினர் பாதுகாப்பு பதிவு' : 'Member Identity Security'}</h5>
            <p className="text-muted mb-0">{lang === 'ta' ? 'டிஜிட்டல் QR அட்டைகள் மூலம் பாதுகாப்பான அடையாள சரிபார்ப்பு.' : 'Providing PII-shielded QR membership identity verification.'}</p>
          </li>
          <li className="list-group-item py-3">
            <h5 className="h6 text-maroon font-bold mb-1"><i className="bi bi-check-circle-fill text-gold me-2"></i>{lang === 'ta' ? 'மக்கள் நல உதவிகள்' : 'Public Relief Campaigns'}</h5>
            <p className="text-muted mb-0">{lang === 'ta' ? 'இயற்கை சீற்றக் காலங்களில் நிவாரண உதவிகள் வழங்குதல்.' : 'Organizing rapid relief efforts during natural calamities.'}</p>
          </li>
        </ul>
      </div>
    </div>
  );
};
