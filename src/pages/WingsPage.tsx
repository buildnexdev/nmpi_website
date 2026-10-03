import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { PageHero } from '../components/ui';

interface Wing {
  id: string;
  name: string;
  name_ta: string;
  description: string;
  description_ta: string;
  icon: string;
  color: string;
}

const WINGS_DATA: Wing[] = [
  {
    id: 'youth',
    name: 'Youth Wing',
    name_ta: 'இளைஞரணி',
    description: 'Empowering young leaders across Tamil Nadu to champion civic rights and social justice.',
    description_ta: 'தமிழகம் முழுவதும் உள்ள இளைஞர்களை ஒருங்கிணைத்து சமூக நலன் மற்றும் உரிமைக்காக செயல்படுதல்.',
    icon: 'bi-lightning-charge-fill',
    color: '#DC2626'
  },
  {
    id: 'women',
    name: 'Women Protection Wing',
    name_ta: 'மகளிரணி',
    description: 'Dedicated to women empowerment, safety, legal aid, and self-reliance initiatives.',
    description_ta: 'பெண்கள் அதிகாரம், பாதுகாப்பு, சட்டம் மற்றும் சுயசார்பு திட்டங்களை முன்னெடுத்தல்.',
    icon: 'bi-shield-heart-fill',
    color: '#DB2777'
  },
  {
    id: 'student',
    name: 'Student Wing',
    name_ta: 'மாணவரணி',
    description: 'Fostering education welfare, scholarships, leadership development in schools & colleges.',
    description_ta: 'பள்ளி மற்றும் கல்லூரிகளில் கல்வி நலம், உதவித்தொகை மற்றும் தலைமைப் பண்பை வளர்த்தல்.',
    icon: 'bi-mortarboard-fill',
    color: '#2563EB'
  },
  {
    id: 'legal',
    name: 'Legal Rights Wing',
    name_ta: 'வழக்கறிஞரணி',
    description: 'Providing pro-bono legal consultation and fighting public interest cases for members.',
    description_ta: 'உறுப்பினர்களுக்கு இலவச சட்ட ஆலோசனைகள் மற்றும் பொதுநல வழக்குகளில் சட்டப் போராட்டம்.',
    icon: 'bi-briefcase-fill',
    color: '#D4AF37'
  },
  {
    id: 'it_media',
    name: 'IT & Digital Media Wing',
    name_ta: 'தகவல் தொழில்நுட்ப அணி',
    description: 'Managing digital outreach, portal development, member verify apps, and social campaigns.',
    description_ta: 'டிஜிட்டல் பிரச்சாரம், இணையதள மேலாண்மை மற்றும் சமூக ஊடக தொடர்புகள் பராமரிப்பு.',
    icon: 'bi-cpu-fill',
    color: '#059669'
  },
  {
    id: 'farmers',
    name: 'Farmers & Environment Wing',
    name_ta: 'விவசாய மற்றும் சுற்றுச்சூழல் அணி',
    description: 'Supporting agricultural rights, water body conservation, and green Tamil Nadu tree drives.',
    description_ta: 'விவசாயிகளின் உரிமைகள், நீர்நிலைப் பாதுகாப்பு மற்றும் பசுமைத் திட்டங்களை நடைமுறைப்படுத்துதல்.',
    icon: 'bi-tree-fill',
    color: '#16A34A'
  }
];

export const WingsPage: React.FC = () => {
  const { lang } = useLanguage();
  const ta = lang === 'ta';

  return (
    <>
      <PageHero
        eyebrow={ta ? 'இயக்க அணிகள்' : 'Organisation wings'}
        title={ta ? 'அமைப்பின் துணை அணிகள்' : 'Our Wings'}
        subtitle={ta ? 'மக்களின் பல்வேறு தேவைகளை நிறைவு செய்ய இயங்கும் பிரத்யேக அணிகள்.' : 'Dedicated wings serving every section of society across Tamil Nadu.'}
      />
      <section className="page-body">
        <div className="container">
          <div className="row g-4">
            {WINGS_DATA.map((w) => (
              <div className="col-md-6 col-lg-4" key={w.id}>
                <div className="card-custom card-hover feature-tile h-100" style={{ borderTop: `4px solid ${w.color}` }}>
                  <div className="feature-icon" style={{ background: `${w.color}1a`, color: w.color }}>
                    <i className={`bi ${w.icon}`}></i>
                  </div>
                  <h2 className="h5">{ta ? w.name_ta : w.name}</h2>
                  <p className="mb-0">{ta ? w.description_ta : w.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="cta-band mt-5 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <h2 className="h4 mb-1">{ta ? 'ஒரு அணியில் சேவை செய்ய விரும்புகிறீர்களா?' : 'Want to serve in a wing?'}</h2>
              <p className="mb-0">{ta ? 'தன்னார்வலராகப் பதிவு செய்து உங்கள் மாவட்ட நிர்வாகிகளைத் தொடர்பு கொள்ளுங்கள்.' : 'Register as a volunteer and your district team will get in touch.'}</p>
            </div>
            <Link to="/join" className="btn btn-gold">{ta ? 'தன்னார்வலராக இணையுங்கள்' : 'Join as a volunteer'}</Link>
          </div>
        </div>
      </section>
    </>
  );
};
