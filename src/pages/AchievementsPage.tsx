import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiClient } from '../services/apiClient';
import { PageHero } from '../components/ui';

interface Stats {
  members: number;
  leaders: number;
  districts: number;
  upcoming_events: number;
}

const MILESTONE_ICONS = ['bi-shield-check', 'bi-tree-fill', 'bi-mortarboard-fill'];

export const AchievementsPage: React.FC = () => {
  const { t, tRaw } = useLanguage();
  const [stats, setStats] = useState<Stats | null>(null);
  const milestones = tRaw<{ title: string; text: string }[]>('achievementsPage.milestones') ?? [];

  useEffect(() => {
    apiClient.get('/public-stats').then((r) => setStats(r.data.data)).catch(() => setStats(null));
  }, []);

  const figures = stats
    ? [
        { value: stats.members, label: t('achievementsPage.figures.members') },
        { value: stats.leaders, label: t('achievementsPage.figures.leaders') },
        { value: stats.districts, label: t('achievementsPage.figures.districts') },
        { value: stats.upcoming_events, label: t('achievementsPage.figures.upcomingEvents') },
      ]
    : [];

  return (
    <>
      <PageHero
        eyebrow={t('nav.achievements')}
        title={t('achievementsPage.title')}
        subtitle={t('achievementsPage.subtitle')}
      />
      <section className="page-body">
        <div className="container">
          {figures.length > 0 && (
            <div className="row g-3 mb-5">
              {figures.map((f) => (
                <div className="col-6 col-lg-3" key={f.label}>
                  <div className="card-custom p-4 text-center h-100">
                    <div className="display-6 fw-bold text-maroon">{f.value.toLocaleString('en-IN')}</div>
                    <div className="small text-muted fw-semibold">{f.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="row g-4">
            {MILESTONE_ICONS.map((icon, i) => (
              <div className="col-md-4" key={icon}>
                <div className="card-custom card-hover feature-tile text-center h-100">
                  <div className="feature-icon mx-auto"><i className={`bi ${icon}`}></i></div>
                  <h2 className="h5">{milestones[i]?.title}</h2>
                  <p className="mb-0">{milestones[i]?.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
