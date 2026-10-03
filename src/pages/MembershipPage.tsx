import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { PageHero } from '../components/ui';

const STEPS = [
  { icon: 'bi-pencil-square', ta: ['விவரங்களை நிரப்புங்கள்', 'பெயர், கைபேசி, மின்னஞ்சல் மற்றும் கடவுச்சொல்.'], en: ['Fill in your details', 'Name, mobile number, email and a password.'] },
  { icon: 'bi-geo-alt', ta: ['அடையாளம் & தொகுதி', 'ஆதார், வாக்காளர் எண் மற்றும் உங்கள் பகுதி.'], en: ['Identity & constituency', 'Aadhaar, Voter ID and where you live.'] },
  { icon: 'bi-qr-code', ta: ['அடையாள அட்டையைப் பெறுங்கள்', 'உடனடியாக QR சரிபார்ப்பு அட்டையைப் பதிவிறக்கவும்.'], en: ['Get your ID card', 'Download your QR-verified card instantly.'] },
];

export const MembershipPage: React.FC = () => {
  const { lang } = useLanguage();
  const ta = lang === 'ta';

  const tiers = [
    {
      key: 'member',
      title: ta ? 'உறுப்பினர்' : 'Member',
      featured: true,
      points: ta
        ? ['QR சரிபார்ப்புடன் டிஜிட்டல் அடையாள அட்டை', 'பொதுக் கூட்டங்கள் மற்றும் நிகழ்வுகளில் பங்கேற்பு', 'இயக்கச் செய்திகள் மற்றும் அறிவிப்புகள்', 'மாவட்ட நிர்வாகிகளுடன் நேரடித் தொடர்பு']
        : ['Digital ID card with QR verification', 'Take part in public meetings and events', 'Organisation news and announcements', 'Direct contact with district leaders'],
    },
    {
      key: 'volunteer',
      title: ta ? 'தன்னார்வலர்' : 'Volunteer',
      featured: false,
      points: ta
        ? ['உறுப்பினருக்கான அனைத்து பலன்களும்', 'கள சேவை மற்றும் நிவாரணப் பணிகள்', 'விழிப்புணர்வு முகாம்களில் பங்கேற்பு', 'பொறுப்புகளுக்கு முன்னுரிமை']
        : ['Everything a member gets', 'Field service and relief work', 'Help run awareness camps', 'First in line for responsibilities'],
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={ta ? 'உறுப்பினர் சேர்க்கை' : 'Membership'}
        title={ta ? 'உறுப்பினராவது இலவசம்' : 'Membership is free'}
        subtitle={ta ? 'கட்டணம் இல்லை. உங்கள் நேரமும் அர்ப்பணிப்பும் மட்டுமே போதும்.' : 'No fees, ever. All we ask for is your time and commitment.'}
      />
      <section className="page-body">
        <div className="container">
          <div className="row g-4 justify-content-center mb-5">
            {tiers.map((t) => (
              <div className="col-md-6 col-lg-5" key={t.key}>
                <div className={`card-custom p-4 p-md-5 h-100 d-flex flex-column ${t.featured ? 'border-2' : ''}`} style={t.featured ? { borderColor: 'var(--accent-gold)' } : undefined}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h2 className="h4 mb-0">{t.title}</h2>
                    {t.featured && <span className="gold-badge">{ta ? 'பெரும்பாலானோர்' : 'Most popular'}</span>}
                  </div>
                  <div className="display-6 fw-bold text-maroon mb-3">{ta ? 'இலவசம்' : 'Free'}</div>
                  <ul className="check-list mb-4">
                    {t.points.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                  <Link to="/join" className={`btn ${t.featured ? 'btn-maroon' : 'btn-outline-maroon'} mt-auto`}>
                    {ta ? 'இப்போதே பதிவு செய்யுங்கள்' : 'Register now'}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="section-head centered">
            <div className="eyebrow">{ta ? 'எப்படி இணைவது' : 'How it works'}</div>
            <h2 className="section-title">{ta ? 'மூன்று எளிய படிகள்' : 'Three simple steps'}</h2>
          </div>
          <div className="row g-4">
            {STEPS.map((s, i) => (
              <div className="col-md-4" key={s.icon}>
                <div className="card-custom feature-tile h-100">
                  <div className={`feature-icon ${i === 2 ? 'gold' : ''}`}><i className={`bi ${s.icon}`}></i></div>
                  <div className="small text-muted fw-bold">{ta ? `படி ${i + 1}` : `Step ${i + 1}`}</div>
                  <h3 className="h5">{ta ? s.ta[0] : s.en[0]}</h3>
                  <p className="mb-0">{ta ? s.ta[1] : s.en[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
