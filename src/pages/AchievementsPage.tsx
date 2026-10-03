import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const AchievementsPage: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <span className="badge gold-badge mb-2">
          {lang === 'ta' ? 'மக்கள் சேவை சாதனைகள்' : 'Public Service Achievements'}
        </span>
        <h1 className="text-maroon fw-bold h2">
          {lang === 'ta' ? 'இயக்கத்தின் முக்கிய சாதனைகள்' : 'Key Organizational Achievements'}
        </h1>
        <p className="text-muted small">
          {lang === 'ta' ? 'மக்களின் உரிமைகளைப் பாதுகாக்கவும் சமூக வளர்ச்சிக்குமான தொடர் சாதனைகள்' : 'Milestones in protecting public rights and fostering community welfare'}
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card-custom p-4 text-center h-100">
            <div className="bg-maroon text-gold rounded-circle p-3 d-inline-flex mb-3">
              <i className="bi bi-shield-check fs-2"></i>
            </div>
            <h3 className="h5 text-maroon font-bold mb-2">
              {lang === 'ta' ? 'உறுப்பினர் பாதுகாப்பு' : 'Member Safety & Rights'}
            </h3>
            <p className="small text-muted mb-0">
              {lang === 'ta' ? 'தமிழ்நாடு முழுவதும் 10,000+ உறுப்பினர்களுக்கு முறையான QR டிஜிட்டல் அடையாள அட்டை வழங்கப்பட்டு பாதுகாப்பு உறுதி செய்யப்பட்டுள்ளது.' : 'Successfully implemented verified digital QR identity cards for 10,000+ active members across Tamil Nadu.'}
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card-custom p-4 text-center h-100">
            <div className="bg-maroon text-gold rounded-circle p-3 d-inline-flex mb-3">
              <i className="bi bi-tree-fill fs-2"></i>
            </div>
            <h3 className="h5 text-maroon font-bold mb-2">
              {lang === 'ta' ? 'சுற்றுச்சூழல் & சமூகம்' : 'Eco & Community Welfare'}
            </h3>
            <p className="small text-muted mb-0">
              {lang === 'ta' ? '50+ இடங்களில் மரக்கன்றுகள் நடுதல், குருதிதான முகாம்கள் மற்றும் இயற்கை விவசாய விழிப்புணர்வு நிகழ்வுகள் நடத்தப்பட்டுள்ளன.' : 'Organized 50+ blood donation drives, tree plantation drives, and sustainable agriculture awareness rallies.'}
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card-custom p-4 text-center h-100">
            <div className="bg-maroon text-gold rounded-circle p-3 d-inline-flex mb-3">
              <i className="bi bi-mortarboard-fill fs-2"></i>
            </div>
            <h3 className="h5 text-maroon font-bold mb-2">
              {lang === 'ta' ? 'இளைஞர் வழிகாட்டுதல்' : 'Youth Empowerment'}
            </h3>
            <p className="small text-muted mb-0">
              {lang === 'ta' ? 'மாணவர்கள் மற்றும் இளைஞர்களுக்குத் தலைமைப்பண்பு மற்றும் வேலைவாய்ப்பு திறன் பயிற்சிகள் தொடர்ந்து வழங்கப்படுகின்றன.' : 'Provided leadership training, educational aid, and vocational guidance to student volunteers.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
