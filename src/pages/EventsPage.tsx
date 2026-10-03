import React, { useCallback, useEffect, useState } from 'react';
import { apiClient, errorMessage } from '../services/apiClient';
import { useLanguage } from '../context/LanguageContext';
import { EmptyState, ErrorBox, EventCard, EventItem, Loader, PageHero } from '../components/ui';

export const EventsPage: React.FC = () => {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
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
        const list: EventItem[] = r.data.data;
        setItems(tab === 'upcoming' ? list : list.filter((e) => e.event_date < today || e.status === 'COMPLETED'));
      })
      .catch((err) => setError(errorMessage(err)));
  }, [tab]);
  useEffect(load, [load]);

  return (
    <>
      <PageHero
        eyebrow={ta ? 'நிகழ்ச்சி நிரல்' : 'Calendar'}
        title={ta ? 'நிகழ்வுகள் & கூட்டங்கள்' : 'Events & Meetings'}
        subtitle={ta ? 'பொதுக் கூட்டங்கள், பேரணிகள் மற்றும் மக்கள் நலத் திட்டங்கள்.' : 'Public meetings, rallies and community programmes across Tamil Nadu.'}
      />
      <section className="page-body">
        <div className="container">
          <div className="d-inline-flex p-1 rounded-pill bg-white border mb-4" role="tablist">
            {(['upcoming', 'past'] as const).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                className={`btn btn-sm ${tab === t ? 'btn-maroon' : 'btn-link text-decoration-none text-secondary'}`}
                onClick={() => setTab(t)}
              >
                {t === 'upcoming' ? (ta ? 'வரவிருப்பவை' : 'Upcoming') : ta ? 'முந்தையவை' : 'Past events'}
              </button>
            ))}
          </div>

          {error ? (
            <ErrorBox message={error} onRetry={load} />
          ) : !items ? (
            <Loader />
          ) : items.length === 0 ? (
            <EmptyState
              icon="bi-calendar-event"
              title={tab === 'upcoming' ? (ta ? 'தற்போது வரவிருக்கும் நிகழ்வுகள் இல்லை' : 'No upcoming events right now') : ta ? 'முந்தைய நிகழ்வுகள் இல்லை' : 'No past events yet'}
              text={tab === 'upcoming' ? (ta ? 'புதிய நிகழ்வுகள் அறிவிக்கப்பட்டவுடன் இங்கே தோன்றும்.' : 'New events will appear here as soon as they are announced.') : undefined}
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
