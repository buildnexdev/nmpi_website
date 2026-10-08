import React, { useCallback, useEffect, useState } from 'react';
import { apiClient, asArray, errorMessage } from '../services/apiClient';
import { useLanguage } from '../context/LanguageContext';
import { EmptyState, ErrorBox, EventCard, EventItem, Loader, PageHero } from '../components/ui';

export const EventsPage: React.FC = () => {
  const { t } = useLanguage();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [items, setItems] = useState<EventItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    setItems(null);
    const params = tab === 'upcoming' ? { upcoming: true } : {};
    apiClient
      .get('/events', { params })
      .then((r) => {
        const today = new Date().toISOString().slice(0, 10);
        const list: EventItem[] = asArray(r.data.data);
        setItems(tab === 'upcoming' ? list : list.filter((e) => e.event_date < today || e.status === 'COMPLETED'));
      })
      .catch((err) => setError(errorMessage(err)));
  }, [tab]);
  useEffect(load, [load]);

  return (
    <>
      <PageHero
        eyebrow={t('eventsPage.eyebrow')}
        title={t('eventsPage.title')}
        subtitle={t('eventsPage.subtitle')}
      />
      <section className="page-body">
        <div className="container">
          <div className="d-inline-flex p-1 rounded-pill bg-white border mb-4" role="tablist">
            {(['upcoming', 'past'] as const).map((key) => (
              <button
                key={key}
                role="tab"
                aria-selected={tab === key}
                className={`btn btn-sm ${tab === key ? 'btn-maroon' : 'btn-link text-decoration-none text-secondary'}`}
                onClick={() => setTab(key)}
              >
                {key === 'upcoming' ? t('eventsPage.tabUpcoming') : t('eventsPage.tabPast')}
              </button>
            ))}
          </div>

          {error ? (
            <ErrorBox message={error} onRetry={load} />
          ) : !items ? (
            <Loader />
        ) : (items || []).length === 0 ? (
            <EmptyState
              icon="bi-calendar-event"
              title={tab === 'upcoming' ? t('eventsPage.emptyUpcomingTitle') : t('eventsPage.emptyPastTitle')}
              text={tab === 'upcoming' ? t('eventsPage.emptyUpcomingText') : undefined}
            />
          ) : (
            <div className="row g-4">
              {items.map((e) => (
                <div className="col-md-6 col-xl-4" key={e.id}><EventCard item={e} /></div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
