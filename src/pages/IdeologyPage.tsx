import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PageHero } from '../components/ui';
import { FounderSection } from '../components/FounderSection';

type Policy = { title: string; text: string };

const PolicyGrid: React.FC<{ items: Policy[]; start: number; tone?: 'gold' }> = ({ items, start, tone }) => (
  <div className="row g-4">
    {items.map((item, i) => (
      <div className="col-md-6" key={start + i}>
        <article className={`card-custom card-hover policy-card ${tone === 'gold' ? 'is-gold' : ''}`}>
          <span className="policy-num">{start + i}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        </article>
      </div>
    ))}
  </div>
);

export const IdeologyPage: React.FC = () => {
  const { t, tRaw } = useLanguage();
  const principles = tRaw<Policy[]>('ideologyPage.principles') ?? [];
  const welfare = tRaw<Policy[]>('ideologyPage.welfare') ?? [];

  return (
    <>
      <PageHero
        eyebrow={t('ideologyPage.eyebrow')}
        title={t('ideologyPage.title')}
        subtitle={t('ideologyPage.subtitle')}
      />
      <section className="page-body">
        <div className="container">
          <h2 className="section-title policy-group-title">{t('ideologyPage.policiesTitle')}</h2>
          <PolicyGrid items={principles} start={1} />

          <h2 className="section-title policy-group-title mt-5">{t('ideologyPage.welfareTitle')}</h2>
          <PolicyGrid items={welfare} start={principles.length + 1} tone="gold" />
        </div>
      </section>
      <FounderSection />
    </>
  );
};
