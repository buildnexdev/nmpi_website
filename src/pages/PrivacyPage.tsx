import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PageHero } from '../components/ui';

const SECTIONS = [
  {
    ta: ['நாங்கள் சேகரிக்கும் தகவல்கள்', 'பெயர், தந்தை/கணவர் பெயர், பிறந்த தேதி, பாலினம், கைபேசி எண், மின்னஞ்சல், இரத்த வகை, புகைப்படம் (விருப்பம்), ஆதார் மற்றும் வாக்காளர் எண், மற்றும் உங்கள் தொகுதி/முகவரி விவரங்கள்.'],
    en: ['Information we collect', "Name, father's/husband's name, date of birth, gender, mobile number, email, blood group, an optional photo, Aadhaar and Voter ID numbers, and your constituency and address details."],
  },
  {
    ta: ['பயன்பாடு', 'உறுப்பினர் பதிவு, அடையாள சரிபார்ப்பு, தொடர்பு மற்றும் இயக்க நிர்வாகத்திற்கு மட்டுமே இத்தகவல்கள் பயன்படுத்தப்படும். இவை விற்கப்படுவதோ மூன்றாம் தரப்பினருடன் பகிரப்படுவதோ இல்லை.'],
    en: ['How we use it', 'Only for membership registration, identity verification, communication and running the organisation. We never sell it or share it with third parties.'],
  },
  {
    ta: ['பாதுகாப்பு', 'ஆதார் மற்றும் வாக்காளர் எண்கள் குறியாக்கம் செய்து சேமிக்கப்படுகின்றன. நிர்வாகிகள் தங்கள் பொறுப்புப் பகுதி உறுப்பினர்களை மட்டுமே பார்க்க முடியும்; அவர்களுக்கும் கடைசி 4 இலக்கங்கள் மட்டுமே தெரியும்.'],
    en: ['Security', 'Aadhaar and Voter ID numbers are stored encrypted. Coordinators can only see members in their own area, and even then only the last four digits.'],
  },
  {
    ta: ['QR குறியீடு', 'உங்கள் அடையாள அட்டையில் உள்ள QR குறியீட்டில் ஒரு சீரற்ற சரிபார்ப்பு டோக்கன் மட்டுமே உள்ளது. ஸ்கேன் செய்தால் பெயர், உறுப்பினர் எண், பொறுப்பு, மாவட்டம் மற்றும் நிலை மட்டுமே காட்டப்படும் — கைபேசி, முகவரி அல்லது அடையாள எண்கள் அல்ல.'],
    en: ['QR code', 'The QR code on your card holds only a random verification token. Scanning it shows your name, member ID, role, district and status — never your phone number, address or ID numbers.'],
  },
  {
    ta: ['உங்கள் உரிமைகள்', 'உங்கள் தகவல்களைத் திருத்த அல்லது உறுப்பினர் பதிவை நீக்க contact@netajimppi.org என்ற முகவரிக்கு எழுதுங்கள்.'],
    en: ['Your rights', 'To correct your details or delete your membership, write to contact@netajimppi.org.'],
  },
];

export const PrivacyPage: React.FC = () => {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  return (
    <>
      <PageHero eyebrow={ta ? 'சட்டம்' : 'Legal'} title={ta ? 'தனியுரிமைக் கொள்கை' : 'Privacy Policy'} />
      <section className="page-body">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="card-custom p-4 p-md-5 rich-text">
            {SECTIONS.map((s, i) => (
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
