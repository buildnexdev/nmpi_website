import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { EmptyState } from '../components/ui';

export const NotFoundPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="page-body">
      <div className="container">
        <EmptyState icon="bi-signpost-2" title={t('notFoundPage.title')} text={t('notFoundPage.text')}>
          <Link to="/" className="btn btn-maroon mt-2">{t('notFoundPage.backHome')}</Link>
        </EmptyState>
      </div>
    </section>
  );
};
