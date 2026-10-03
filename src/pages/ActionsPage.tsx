import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { PageHero } from '../components/ui';

const ACTIONS = [
  { icon: 'bi-qr-code', ta: ['உறுப்பினர் அடையாளப் பாதுகாப்பு', 'QR சரிபார்ப்பு டிஜிட்டல் அடையாள அட்டைகள் மூலம் போலி உறுப்பினர்களைத் தடுத்தல்.'], en: ['Secure member identity', 'QR-verified digital ID cards so anyone can confirm a genuine member.'] },
  { icon: 'bi-life-preserver', ta: ['மக்கள் நல நிவாரணம்', 'இயற்கைப் பேரிடர் காலங்களில் விரைவான நிவாரண உதவிகள்.'], en: ['Disaster relief', 'Rapid relief and support for families during natural calamities.'] },
  { icon: 'bi-droplet', ta: ['இரத்த தான முகாம்கள்', 'மாவட்டந்தோறும் இரத்த தான முகாம்கள் மற்றும் அவசர உதவி.'], en: ['Blood donation camps', 'Regular district-level donation camps and emergency donor support.'] },
  { icon: 'bi-megaphone', ta: ['விழிப்புணர்வு இயக்கங்கள்', 'சட்ட உரிமைகள், பாதுகாப்பு மற்றும் சுகாதார விழிப்புணர்வு.'], en: ['Awareness drives', 'Campaigns on legal rights, personal safety and public health.'] },
  { icon: 'bi-tree', ta: ['பசுமைத் திட்டங்கள்', 'மரக்கன்று நடுதல் மற்றும் நீர்நிலைப் பாதுகாப்பு.'], en: ['Green initiatives', 'Tree planting and protection of local water bodies.'] },
  { icon: 'bi-mortarboard', ta: ['இளைஞர் வழிகாட்டுதல்', 'மாணவர்களுக்குத் தலைமைப் பண்பு மற்றும் திறன் பயிற்சி.'], en: ['Youth guidance', 'Leadership and skills training for students and young people.'] },
];

export const ActionsPage: React.FC = () => {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  return (
    <>
      <PageHero
        eyebrow={ta ? 'செயல்பாடுகள்' : 'Our work'}
        title={ta ? 'இயக்கத்தின் செயல்பாடுகள்' : 'Actions & Community Initiatives'}
        subtitle={ta ? 'தமிழகம் முழுவதும் எங்கள் உறுப்பினர்கள் முன்னெடுக்கும் சேவைப் பணிகள்.' : 'The service work our members carry out across Tamil Nadu.'}
      />
      <section className="page-body">
        <div className="container">
          <div className="row g-4">
            {ACTIONS.map((a) => (
              <div className="col-md-6" key={a.icon}>
                <div className="card-custom p-4 d-flex gap-3 h-100">
                  <div className="feature-icon mb-0 flex-shrink-0"><i className={`bi ${a.icon}`}></i></div>
                  <div>
                    <h2 className="h5 mb-1">{ta ? a.ta[0] : a.en[0]}</h2>
                    <p className="mb-0 text-muted">{ta ? a.ta[1] : a.en[1]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link to="/events" className="btn btn-maroon me-2">{ta ? 'வரவிருக்கும் நிகழ்வுகள்' : 'Upcoming events'}</Link>
            <Link to="/join" className="btn btn-outline-maroon">{ta ? 'இணைந்து பங்களியுங்கள்' : 'Join and contribute'}</Link>
          </div>
        </div>
      </section>
    </>
  );
};
