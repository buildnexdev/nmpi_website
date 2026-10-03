import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { EmptyState } from '../components/ui';

export const NotFoundPage: React.FC = () => {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  return (
    <section className="page-body">
      <div className="container">
        <EmptyState
          icon="bi-signpost-2"
          title={ta ? 'பக்கம் கிடைக்கவில்லை' : 'Page not found'}
          text={ta ? 'நீங்கள் தேடும் பக்கம் நகர்த்தப்பட்டிருக்கலாம் அல்லது நீக்கப்பட்டிருக்கலாம்.' : 'The page you are looking for may have been moved or removed.'}
        >
          <Link to="/" className="btn btn-maroon mt-2">{ta ? 'முகப்புக்குச் செல்' : 'Back to home'}</Link>
        </EmptyState>
      </div>
    </section>
  );
};
