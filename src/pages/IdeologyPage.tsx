import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PageHero } from '../components/ui';
import { FounderSection } from '../components/FounderSection';

type Policy = { title: string; text: string };

const PRINCIPLE_ICONS = ['bi-ban', 'bi-shield-check', 'bi-mortarboard', 'bi-truck', 'bi-briefcase', 'bi-basket', 'bi-people', 'bi-bank', 'bi-heart-pulse', 'bi-eye'];
const WELFARE_ICONS = ['bi-check2-square', 'bi-signpost-2', 'bi-heart', 'bi-droplet', 'bi-flag', 'bi-person-x', 'bi-book', 'bi-building', 'bi-file-earmark-text', 'bi-stars'];

/** Vertical timeline; the centre line fills with gold and nodes light up as the reader scrolls past them. */
const PolicyTimeline: React.FC<{
  id?: string;
  title: string;
  items: Policy[];
  start: number;
  icons: string[];
  tone?: 'gold';
  Heading: 'h2' | 'h3';
}> = ({ id, title, items, start, icons, tone, Heading }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const mark = window.innerHeight * 0.6;
      const rect = list.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (mark - rect.top) / rect.height));
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${progress})`;
      list.querySelectorAll<HTMLElement>('.timeline-node').forEach((node) => {
        node.classList.toggle('is-passed', node.getBoundingClientRect().top < mark);
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items.length]);

  return (
    <div id={id} className={`policy-timeline-group ${tone === 'gold' ? 'is-gold' : ''}`}>
      <Heading className="timeline-heading" data-reveal="zoom">
        <span>{title}</span>
      </Heading>
      <div className="policy-timeline" ref={listRef}>
        <span className="timeline-line" aria-hidden="true">
          <span className="timeline-fill" ref={fillRef}></span>
        </span>
        <ol className="timeline-list">
          {items.map((item, i) => {
            const number = start + i;
            const side = i % 2 === 0 ? 'left' : 'right';
            return (
              <li className={`timeline-item is-${side}`} key={number}>
                <span className="timeline-node" aria-hidden="true">{number}</span>
                <article className="timeline-card" data-reveal={side}>
                  <span className="timeline-icon"><i className={`bi ${icons[i % icons.length]}`}></i></span>
                  <div className="timeline-body">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                  <span className="timeline-watermark" aria-hidden="true">{String(number).padStart(2, '0')}</span>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

/** Both policy lists (principles, then welfare activities) as timelines. */
export const IdeologyPolicies: React.FC<{ headingLevel?: 'h2' | 'h3' }> = ({ headingLevel = 'h2' }) => {
  const { t, tRaw } = useLanguage();
  const principles = tRaw<Policy[]>('ideologyPage.principles') ?? [];
  const welfare = tRaw<Policy[]>('ideologyPage.welfare') ?? [];
  return (
    <>
      <PolicyTimeline id="policies" title={t('ideologyPage.policiesTitle')} items={principles} start={1} icons={PRINCIPLE_ICONS} Heading={headingLevel} />
      <PolicyTimeline
        id="welfare"
        title={t('ideologyPage.welfareTitle')}
        items={welfare}
        start={principles.length + 1}
        icons={WELFARE_ICONS}
        tone="gold"
        Heading={headingLevel}
      />
    </>
  );
};

export const IdeologyPage: React.FC = () => {
  const { t, tRaw } = useLanguage();
  const principleCount = tRaw<Policy[]>('ideologyPage.principles')?.length ?? 0;
  const welfareCount = tRaw<Policy[]>('ideologyPage.welfare')?.length ?? 0;

  return (
    <>
      <PageHero eyebrow={t('ideologyPage.eyebrow')} title={t('ideologyPage.title')} subtitle={t('ideologyPage.subtitle')} icon="bi-compass">
        <div className="hero-jump-links">
          <a href="#policies" className="hero-jump">
            <strong>{principleCount}</strong>
            <span>{t('ideologyPage.policiesShort')}</span>
            <i className="bi bi-arrow-down"></i>
          </a>
          <a href="#welfare" className="hero-jump is-gold">
            <strong>{welfareCount}</strong>
            <span>{t('ideologyPage.welfareShort')}</span>
            <i className="bi bi-arrow-down"></i>
          </a>
        </div>
      </PageHero>
      <section className="page-body ideology-body">
        <div className="container">
          <IdeologyPolicies />
        </div>
      </section>
      <FounderSection />
    </>
  );
};
