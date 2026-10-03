import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PageHero } from '../components/ui';

const TERMS = [
  {
    ta: ['தகுதி', 'இந்தியக் குடிமக்களாகிய 18 வயது நிரம்பிய எவரும் உறுப்பினராகலாம்.'],
    en: ['Eligibility', 'Any Indian citizen aged 18 or over may become a member.'],
  },
  {
    ta: ['உண்மையான தகவல்', 'பதிவின்போது வழங்கும் அனைத்துத் தகவல்களும் உண்மையாகவும் உங்களுடையதாகவும் இருக்க வேண்டும். தவறான தகவல் கண்டறியப்பட்டால் உறுப்பினர் பதிவு ரத்து செய்யப்படலாம்.'],
    en: ['Accurate information', 'Everything you provide must be true and your own. Registrations found to be false may be cancelled.'],
  },
  {
    ta: ['அடையாள அட்டை', 'டிஜிட்டல் அடையாள அட்டை இயக்கத்தின் சொத்து. அதைத் தவறாகப் பயன்படுத்துவது அல்லது பிறருக்கு வழங்குவது தடைசெய்யப்பட்டுள்ளது.'],
    en: ['ID card', 'The digital ID card remains the property of the organisation. Misusing it or lending it to others is not allowed.'],
  },
  {
    ta: ['நடத்தை', 'உறுப்பினர்கள் சட்டத்திற்கு உட்பட்டு, ஒழுக்கத்துடனும் பிறரை மதித்தும் செயல்பட வேண்டும்.'],
    en: ['Conduct', 'Members must act lawfully, with discipline and respect for others.'],
  },
  {
    ta: ['இடைநீக்கம்', 'விதிமுறைகளை மீறும் உறுப்பினர்களின் பதிவை இயக்க நிர்வாகம் இடைநீக்கம் அல்லது ரத்து செய்யலாம்.'],
    en: ['Suspension', 'The organisation may suspend or cancel the membership of anyone who breaks these terms.'],
  },
];

export const TermsPage: React.FC = () => {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  return (
    <>
      <PageHero eyebrow={ta ? 'சட்டம்' : 'Legal'} title={ta ? 'உறுப்பினர் விதிமுறைகள்' : 'Terms & Conditions'} />
      <section className="page-body">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="card-custom p-4 p-md-5 rich-text">
            {TERMS.map((s, i) => (
              <React.Fragment key={s.en[0]}>
                <h2>{i + 1}. {ta ? s.ta[0] : s.en[0]}</h2>
                <p>{ta ? s.ta[1] : s.en[1]}</p>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
