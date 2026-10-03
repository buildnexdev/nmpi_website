import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PageHero } from '../components/ui';

const PRINCIPLES = [
  { icon: 'bi-flag', ta: ['தேசப்பற்று', 'நேதாஜியின் வழியில் நாட்டுக்கும் மக்களுக்கும் தன்னலமற்ற சேவை.'], en: ['Patriotism', "Selfless service to the nation and its people, in Netaji's footsteps."] },
  { icon: 'bi-eye', ta: ['வெளிப்படையான நிர்வாகம்', 'அனைத்து நிலைகளிலும் நேர்மையும் பொறுப்புணர்வும்.'], en: ['Transparent administration', 'Integrity and accountability at every level of the organisation.'] },
  { icon: 'bi-people', ta: ['சமூக நீதி & சமத்துவம்', 'அனைத்து தரப்பு மக்களின் குரலையும் சமமாக மதித்தல்.'], en: ['Social justice & equality', 'Every voice in the community is heard and respected equally.'] },
  { icon: 'bi-shield-check', ta: ['மக்கள் பாதுகாப்பு', 'பொதுமக்களின் உரிமைகள் மற்றும் நலனைக் காத்தல்.'], en: ['Public safety', 'Protecting the rights, safety and welfare of ordinary people.'] },
  { icon: 'bi-award', ta: ['ஒழுக்கம்', 'கட்டுப்பாடும் ஒற்றுமையும் கொண்ட செயல்பாடு.'], en: ['Discipline', 'Work carried out with order, unity and self-control.'] },
  { icon: 'bi-hand-thumbs-up', ta: ['சேவை மனப்பான்மை', 'பதவிக்கு அல்ல, மக்களுக்கான சேவைக்கே முன்னுரிமை.'], en: ['Spirit of service', 'Service to people comes before any position or title.'] },
];

export const IdeologyPage: React.FC = () => {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  return (
    <>
      <PageHero
        eyebrow={ta ? 'கொள்கைகள்' : 'Ideology'}
        title={ta ? 'இயக்கத்தின் கொள்கைகள்' : 'Ideology & Principles'}
        subtitle={ta ? 'நேதாஜி சுபாஷ் சந்திர போஸ் அவர்களின் தேசப்பற்று, ஒழுக்கம் மற்றும் மக்கள் சேவை சிந்தனைகளை அடிப்படையாகக் கொண்டு செயல்படுகிறோம்.' : "Guided by Netaji Subhas Chandra Bose's ideals of patriotic service, discipline and equality."}
      />
      <section className="page-body">
        <div className="container">
          <div className="row g-4">
            {PRINCIPLES.map((p, i) => (
              <div className="col-md-6 col-lg-4" key={p.icon}>
                <div className="card-custom card-hover feature-tile h-100">
                  <div className={`feature-icon ${i % 3 === 1 ? 'gold' : i % 3 === 2 ? 'dark' : ''}`}><i className={`bi ${p.icon}`}></i></div>
                  <h2 className="h5">{ta ? p.ta[0] : p.en[0]}</h2>
                  <p className="mb-0">{ta ? p.ta[1] : p.en[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
