import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const IdeologyPage: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <div className="container py-5">
      <div className="card-custom p-4 p-md-5">
        <h1 className="text-maroon fw-bold h2 mb-4">
          {lang === 'ta' ? 'இயக்கத்தின் கொள்கைகள்' : 'Ideology & Principles'}
        </h1>
        <p className="lead text-muted mb-4">
          {lang === 'ta'
            ? 'நேதாஜி சுபாஷ் சந்திர போஸ் அவர்களின் தேசிய நேர்மை, ஒழுக்கம் மற்றும் மக்கள் சேவை சிந்தனைகளை அடிப்படையாகக் கொண்டு செயல்படுகிறோம்.'
            : 'Inspired by Netaji Subhash Chandra Bose\'s principles of patriotic service, discipline, social equality, and transparent governance.'}
        </p>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="p-4 bg-light rounded border border-gold">
              <h4 className="h5 text-maroon font-bold">1. {lang === 'ta' ? 'வெளிப்படையான நிர்வாகம்' : 'Transparent Administration'}</h4>
              <p className="small text-muted mb-0">
                {lang === 'ta' ? 'அனைத்து நிலைகளிலும் உண்மை மற்றும் வெளிப்படைத்தன்மையுடன் கூடிய மக்கள் சேவை.' : 'Ensuring integrity and accountability across every regional unit and administrative tier.'}
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-4 bg-light rounded border border-gold">
              <h4 className="h5 text-maroon font-bold">2. {lang === 'ta' ? 'சமூக நீதி & சமத்துவம்' : 'Social Justice & Equality'}</h4>
              <p className="small text-muted mb-0">
                {lang === 'ta' ? 'அனைத்து தரப்பு மக்களின் குரலையும் சமமாக மதித்து பாதுகாப்பு அளித்தல்.' : 'Protecting public welfare and upholding equal opportunity for all community members.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
