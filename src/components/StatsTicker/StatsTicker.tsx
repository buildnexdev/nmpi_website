import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CountUp } from '../CountUp';
import './StatsTicker.css';

export interface PublicStats {
  members: number;
  leaders: number;
  districts: number;
  upcoming_events: number;
}

const ITEMS: { field: keyof PublicStats; labelKey: string; icon: string }[] = [
  { field: 'members', labelKey: 'hero.stats.members', icon: 'bi-people-fill' },
  { field: 'leaders', labelKey: 'hero.stats.leaders', icon: 'bi-person-badge-fill' },
  { field: 'districts', labelKey: 'hero.stats.districts', icon: 'bi-geo-alt-fill' },
  { field: 'upcoming_events', labelKey: 'hero.stats.upcomingEvents', icon: 'bi-calendar-event-fill' },
];

/** Live movement figures in a single scrolling line; numbers count up when first seen. */
export const StatsTicker: React.FC<{ stats: PublicStats }> = ({ stats }) => {
  const { t } = useLanguage();

  // Each half holds the items twice so the loop stays seamless on wide screens.
  const half = (copy: number) =>
    [0, 1].flatMap((round) =>
      ITEMS.map((item) => (
        <li className="ticker-item" key={`${copy}-${round}-${item.field}`}>
          <span className="ticker-icon"><i className={`bi ${item.icon}`}></i></span>
          <CountUp value={stats[item.field] ?? 0} className="ticker-value" />
          <span className="ticker-label">{t(item.labelKey)}</span>
          <span className="ticker-sep" aria-hidden="true">✦</span>
        </li>
      ))
    );

  return (
    <section className="stats-ticker no-reveal" aria-label={t('homePage.statsAria')}>
      <ul className="visually-hidden">
        {ITEMS.map((item) => (
          <li key={item.field}>{`${stats[item.field] ?? 0} ${t(item.labelKey)}`}</li>
        ))}
      </ul>
      <div className="ticker-viewport" aria-hidden="true">
        <ul className="ticker-track">
          {half(0)}
          {half(1)}
        </ul>
      </div>
    </section>
  );
};
