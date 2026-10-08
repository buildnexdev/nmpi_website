import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { PageHero } from '../components/ui';

const ACTION_ICONS = ['bi-qr-code', 'bi-life-preserver', 'bi-droplet', 'bi-megaphone', 'bi-tree', 'bi-mortarboard'];

export const ActionsPage: React.FC = () => {
  const { t, tRaw } = useLanguage();
  const actions = tRaw<{ title: string; text: string }[]>('actionsPage.actions') ?? [];
  return (
    <>
      <PageHero
        eyebrow={t('actionsPage.eyebrow')}
        title={t('actionsPage.title')}
        subtitle={t('actionsPage.subtitle')}
      />
      <section className="page-body">
        <div className="container">
          <div className="row g-4">
            {ACTION_ICONS.map((icon, i) => (
              <div className="col-md-6" key={icon}>
                <div className="card-custom p-4 d-flex gap-3 h-100">
                  <div className="feature-icon mb-0 flex-shrink-0"><i className={`bi ${icon}`}></i></div>
                  <div>
                    <h2 className="h5 mb-1">{actions[i]?.title}</h2>
                    <p className="mb-0 text-muted">{actions[i]?.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link to="/events" className="btn btn-maroon me-2">{t('actionsPage.upcomingEvents')}</Link>
            <Link to="/join" className="btn btn-outline-maroon">{t('actionsPage.joinContribute')}</Link>
          </div>
        </div>
      </section>
    </>
  );
};
