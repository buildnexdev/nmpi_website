import React from 'react';
import { Link } from 'react-router-dom';
import { CmsPage } from '../components/CmsPage';
import { useLanguage } from '../context/LanguageContext';
import { mediaUrl } from '../services/apiClient';

export const AboutPage: React.FC = () => {
  const { lang } = useLanguage();
  const ta = lang === 'ta';

  const aside = (
    <div className="d-flex flex-column gap-4">
      <img src={mediaUrl('/uploads/IMG-20260925-WA0072.jpg')} alt="" className="w-100 rounded-4 shadow" style={{ aspectRatio: '4 / 3', objectFit: 'cover' }} />
      <div className="card-custom p-4">
        <h3 className="h5 mb-3">{ta ? 'எங்கள் அடிப்படை மதிப்புகள்' : 'Our core values'}</h3>
        <ul className="check-list mb-0">
          <li>{ta ? 'மக்களின் பாதுகாப்பு' : 'Public safety'}</li>
          <li>{ta ? 'சமூக நீதி' : 'Social justice'}</li>
          <li>{ta ? 'வெளிப்படையான நிர்வாகம்' : 'Transparent administration'}</li>
          <li>{ta ? 'ஒழுக்கம் மற்றும் சேவை' : 'Discipline and service'}</li>
        </ul>
      </div>
      <div className="cta-band p-4">
        <h3 className="h5">{ta ? 'இயக்கத்தில் இணையுங்கள்' : 'Join the movement'}</h3>
        <p className="small">{ta ? 'இலவச பதிவு, உடனடி டிஜிட்டல் அடையாள அட்டை.' : 'Free registration and an instant digital ID card.'}</p>
        <Link to="/join" className="btn btn-gold btn-sm">{ta ? 'இப்போதே இணையுங்கள்' : 'Register now'}</Link>
      </div>
    </div>
  );

  return (
    <CmsPage
      pageKey="about"
      eyebrow={{ ta: 'இயக்கம் பற்றி', en: 'About us' }}
      fallbackTitle={{ ta: 'நேதாஜி மக்கள் பாதுகாப்பு இயக்கம் பற்றி', en: 'About Netaji Makkal Pathukappu Iyakkam' }}
      image={mediaUrl('/uploads/IMG-20260925-WA0072.jpg')}
      aside={aside}
    />
  );
};
