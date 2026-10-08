import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection/HeroSection';
import { PublicStats, StatsTicker } from '../components/StatsTicker/StatsTicker';
import { EventCard, EventItem, LeaderPhoto, NewsCard, NewsItem } from '../components/ui';
import { FounderSection } from '../components/FounderSection';
import { HomeAboutShowcase } from '../components/home/HomeAboutShowcase';
import { IdeologyPolicies } from './IdeologyPage';
import { AchievementMilestones } from './AchievementsPage';
import { ActionsGrid } from './ActionsPage';
import { StructureTiers } from './StructurePage';
import { WingsGrid } from './WingsPage';
import { apiClient, asArray, mediaUrl, pick } from '../services/apiClient';
import { useLanguage } from '../context/LanguageContext';

const BlockHead: React.FC<{
  index: number;
  eyebrow: string;
  title: string;
  lead?: string;
  link?: { to: string; label: string };
  light?: boolean;
}> = ({ index, eyebrow, title, lead, link, light }) => (
  <div className={`home-block-head ${light ? 'is-light' : ''}`}>
    <span className="home-block-num" aria-hidden="true">{String(index).padStart(2, '0')}</span>
    <div className="home-block-text">
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="section-title mb-0">{title}</h2>
      {lead && <p className="section-lead mt-2 mb-0">{lead}</p>}
    </div>
    {link && (
      <Link to={link.to} className={`btn btn-sm ${light ? 'btn-ghost-light' : 'btn-outline-maroon'} home-block-link`}>
        {link.label}<i className="bi bi-arrow-right ms-1"></i>
      </Link>
    )}
  </div>
);

export const HomePage: React.FC = () => {
  const { lang, t, tRaw } = useLanguage();
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [news, setNews] = useState<NewsItem[] | null>(null);
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/public-stats').then((r) => setStats(r.data.data ?? null)).catch(() => setStats(null));
    apiClient.get('/news', { params: { limit: 3 } }).then((r) => setNews(asArray(r.data.data).slice(0, 3))).catch(() => setNews([]));
    apiClient.get('/events', { params: { upcoming: true, limit: 3 } }).then((r) => setEvents(asArray(r.data.data).slice(0, 3))).catch(() => setEvents([]));
    apiClient.get('/leadership').then((r) => setLeaders(asArray(r.data.data).slice(0, 4))).catch(() => {});
  }, []);

  const learnMore = t('common.learnMore');

  return (
    <>
      <HeroSection />
      {stats && <StatsTicker stats={stats} />}

      <HomeAboutShowcase />

      <section id="home-ideology" className="section section-cream home-block">
        <div className="container">
          <BlockHead
            index={2}
            eyebrow={t('ideologyPage.eyebrow')}
            title={t('ideologyPage.title')}
            lead={t('ideologyPage.subtitle')}
            link={{ to: '/ideology', label: learnMore }}
          />
          <IdeologyPolicies headingLevel="h3" />
        </div>
      </section>

      <section id="home-achievements" className="section section-cream home-block">
        <div className="container">
          <BlockHead
            index={3}
            eyebrow={t('nav.achievements')}
            title={t('achievementsPage.title')}
            lead={t('achievementsPage.subtitle')}
            link={{ to: '/achievements', label: learnMore }}
          />
          <AchievementMilestones headingLevel="h3" />
        </div>
      </section>

      <section id="home-actions" className="section section-white home-block">
        <div className="container">
          <BlockHead
            index={4}
            eyebrow={t('actionsPage.eyebrow')}
            title={t('actionsPage.title')}
            lead={t('actionsPage.subtitle')}
            link={{ to: '/actions', label: learnMore }}
          />
          <ActionsGrid headingLevel="h3" />
        </div>
      </section>

      <section id="home-structure" className="section section-cream home-block">
        <div className="container">
          <BlockHead
            index={5}
            eyebrow={t('structurePage.eyebrow')}
            title={t('structurePage.fallbackTitle')}
            link={{ to: '/structure', label: learnMore }}
          />
          <StructureTiers />
          {leaders.length > 0 && (
            <>
              <h3 className="section-title policy-group-title mt-5" data-reveal="left">{t('homePage.districtExecutives')}</h3>
              <div className="row g-4">
                {leaders.map((l) => (
                  <div className="col-6 col-lg-3" key={l.id}>
                    <div className="card-custom card-hover leader-card">
                      <LeaderPhoto src={l.photo_url} name={l.name} size={96} />
                      <h4 className="leader-name">{pick(l, 'name', lang)}</h4>
                      <div className="leader-role">{pick(l, 'designation', lang)}</div>
                      {l.district && <div className="small text-muted mt-1"><i className="bi bi-geo-alt me-1"></i>{pick(l, 'district', lang)}</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <Link to="/leadership" className="btn btn-maroon">{t('structurePage.meetExecutives')}<i className="bi bi-arrow-right ms-2"></i></Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section id="home-wings" className="section section-white home-block">
        <div className="container">
          <BlockHead
            index={6}
            eyebrow={t('wingsPage.eyebrow')}
            title={t('wingsPage.title')}
            lead={t('wingsPage.subtitle')}
            link={{ to: '/wings', label: learnMore }}
          />
          <WingsGrid headingLevel="h3" />
        </div>
      </section>

      <FounderSection showPoliciesLink />

      <section id="home-news" className="section section-white home-block">
        <div className="container">
          <BlockHead
            index={7}
            eyebrow={t('homePage.newsEyebrow')}
            title={t('homePage.newsTitle')}
            link={{ to: '/news', label: t('homePage.allNews') }}
          />
          {news && news.length === 0 ? (
            <p className="text-muted">{t('homePage.noNews')}</p>
          ) : (
            <div className="row g-4">
              {(news || []).map((n) => (
                <div className="col-md-6 col-lg-4" key={n.id}><NewsCard item={n} /></div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="home-events" className="section section-cream home-block">
        <div className="container">
          <BlockHead
            index={8}
            eyebrow={t('homePage.eventsEyebrow')}
            title={t('homePage.eventsTitle')}
            link={{ to: '/events', label: t('homePage.allEvents') }}
          />
          {events && events.length === 0 ? (
            <p className="text-muted">{t('homePage.noEvents')}</p>
          ) : (
            <div className="row g-4">
              {(events || []).map((e) => (
                <div className="col-lg-4 col-md-6" key={e.id}><EventCard item={e} /></div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-sm section-white">
        <div className="container">
          <div className="cta-band" data-reveal="zoom">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <h2 className="mb-2">{t('homePage.ctaTitle')}</h2>
                <p className="mb-0">{t('homePage.ctaText')}</p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link to="/join" className="btn btn-gold btn-lg">
                  <i className="bi bi-person-plus-fill me-2"></i>{t('common.registerNow')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
