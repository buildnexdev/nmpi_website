import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PageHero } from '../components/ui';

export const TermsPage: React.FC = () => {
  const { t, tRaw } = useLanguage();
  const sections = tRaw<{ heading: string; text: string }[]>('termsPage.sections') ?? [];
  return (
    <>
      <PageHero eyebrow={t('termsPage.eyebrow')} title={t('termsPage.title')} />
      <section className="page-body">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="card-custom p-4 p-md-5 rich-text">
            {sections.map((s, i) => (
              <React.Fragment key={i}>
                <h2>{i + 1}. {s.heading}</h2>
                <p>{s.text}</p>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
