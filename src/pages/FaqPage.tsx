import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { PageHero } from '../components/ui';

export const FaqPage: React.FC = () => {
  const { t, tRaw } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);
  const faqs = tRaw<{ q: string; a: string }[]>('faqPage.items') ?? [];
  return (
    <>
      <PageHero eyebrow={t('faqPage.eyebrow')} title={t('faqPage.title')} />
      <section className="page-body">
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="d-flex flex-column gap-3">
            {faqs.map(({ q, a }, i) => {
              const isOpen = open === i;
              return (
                <div className="card-custom" key={i}>
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
            {t('faqPage.stillQuestion')} <Link to="/contact" className="fw-semibold">{t('faqPage.contactUs')}</Link>
          </p>
        </div>
      </section>
    </>
  );
};
