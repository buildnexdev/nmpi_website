import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { PageHero } from '../components/ui';

const FAQS = [
  {
    ta: ['உறுப்பினராக கட்டணம் உண்டா?', 'இல்லை. உறுப்பினர் பதிவு முற்றிலும் இலவசம்.'],
    en: ['Is there a membership fee?', 'No. Registration is completely free.'],
  },
  {
    ta: ['எனது டிஜிட்டல் அடையாள அட்டையை எப்படிப் பெறுவது?', 'பதிவு முடிந்ததும் அட்டையை உடனே பதிவிறக்கலாம். பின்னர் எப்போது வேண்டுமானாலும் உள்நுழைந்து "எனது சுயவிவரம்" பக்கத்திலிருந்து மீண்டும் பெறலாம்.'],
    en: ['How do I get my digital ID card?', 'You can download it straight after registering. Later, log in and download it again any time from your profile page.'],
  },
  {
    ta: ['QR குறியீட்டில் எனது கைபேசி எண் அல்லது முகவரி உள்ளதா?', 'இல்லை. QR குறியீட்டில் ஒரு பாதுகாப்பான சரிபார்ப்பு டோக்கன் மட்டுமே உள்ளது. ஸ்கேன் செய்தால் பெயர், உறுப்பினர் எண், மாவட்டம் மற்றும் நிலை மட்டுமே காட்டப்படும்.'],
    en: ['Does the QR code expose my phone number or address?', 'No. The QR code holds only a secure verification token. Scanning it shows just your name, member ID, district and status.'],
  },
  {
    ta: ['எனது ஆதார் மற்றும் வாக்காளர் எண் பாதுகாப்பாக உள்ளதா?', 'ஆம். இவை குறியாக்கம் செய்து சேமிக்கப்படுகின்றன; நிர்வாகிகளுக்குக் கூட கடைசி 4 இலக்கங்கள் மட்டுமே தெரியும்.'],
    en: ['Are my Aadhaar and Voter ID safe?', 'Yes. Both are stored encrypted, and even administrators only see the last four digits.'],
  },
  {
    ta: ['எனது நிலை "பரிசீலனையில்" அல்லது "இடைநீக்கம்" என்று உள்ளது. ஏன்?', 'பகுதி நிர்வாகிகள் ஒரு பதிவை மறுபரிசீலனைக்கு உட்படுத்தலாம் அல்லது இடைநீக்கம் செய்யலாம். உங்கள் மாவட்ட நிர்வாகிகளை அல்லது எங்கள் அலுவலகத்தைத் தொடர்பு கொள்ளுங்கள்.'],
    en: ['My status says "Pending" or "Suspended". Why?', 'Area coordinators can put a registration under review or suspend it. Please contact your district team or our office.'],
  },
  {
    ta: ['கடவுச்சொல்லை மறந்துவிட்டேன். என்ன செய்வது?', 'எங்கள் அலுவலகத்தைத் தொடர்பு கொள்ளுங்கள்; சரிபார்ப்புக்குப் பின் உதவுவோம். உள்நுழைந்திருந்தால் சுயவிவரப் பக்கத்தில் கடவுச்சொல்லை மாற்றலாம்.'],
    en: ['I forgot my password. What should I do?', 'Contact our office and we will help after verifying your identity. If you are logged in, you can change it on your profile page.'],
  },
];

export const FaqPage: React.FC = () => {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      <PageHero eyebrow={ta ? 'உதவி' : 'Help'} title={ta ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Frequently Asked Questions'} />
      <section className="page-body">
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="d-flex flex-column gap-3">
            {FAQS.map((f, i) => {
              const [q, a] = ta ? f.ta : f.en;
              const isOpen = open === i;
              return (
                <div className="card-custom" key={f.en[0]}>
                  <button
                    type="button"
                    className="w-100 text-start bg-transparent border-0 p-4 d-flex justify-content-between align-items-center gap-3 fw-bold text-ink"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{q}</span>
                    <i className={`bi ${isOpen ? 'bi-dash-circle' : 'bi-plus-circle'} text-maroon fs-5`}></i>
                  </button>
                  {isOpen && <div id={`faq-${i}`} className="px-4 pb-4 text-muted">{a}</div>}
                </div>
              );
            })}
          </div>
          <p className="text-center mt-5 mb-0">
            {ta ? 'வேறு கேள்விகள் உள்ளதா?' : 'Still have a question?'} <Link to="/contact" className="fw-semibold">{ta ? 'எங்களைத் தொடர்பு கொள்ளுங்கள்' : 'Contact us'}</Link>
          </p>
        </div>
      </section>
    </>
  );
};
