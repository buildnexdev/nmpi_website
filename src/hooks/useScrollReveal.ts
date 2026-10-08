import { RefObject, useEffect } from 'react';

const REVEAL_SELECTOR = [
  '[data-reveal]',
  '.section-head',
  '.home-block-head',
  '.card-custom',
  '.cta-band',
  '.founder-photo',
  '.founder-goal',
  '.founder-slogans',
  '.gallery-item',
  '.leader-card',
  '.history-media',
].join(',');

/**
 * Fades/slides content in as it scrolls into view, for everything rendered inside `rootRef`
 * (including content that arrives later from the API). Siblings are staggered slightly.
 */
export function useScrollReveal(rootRef: RefObject<HTMLElement>, resetKey: string): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const timers: number[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.classList.add('is-visible');
          observer.unobserve(el);
          // Drop the reveal classes afterwards so hover transforms on cards keep working.
          const delay = parseInt(el.style.getPropertyValue('--reveal-delay'), 10) || 0;
          timers.push(
            window.setTimeout(() => {
              el.classList.remove('reveal', 'is-visible', `reveal-${el.dataset.reveal}`);
              el.style.removeProperty('--reveal-delay');
              el.dataset.revealed = '1';
            }, 900 + delay)
          );
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );

    const prepare = () => {
      root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => {
        if (el.dataset.revealed || el.classList.contains('reveal') || el.parentElement?.closest('.reveal, [data-revealed], .no-reveal')) return;
        const siblings = el.parentElement?.parentElement?.children;
        const column = el.parentElement && siblings ? Array.prototype.indexOf.call(siblings, el.parentElement) : 0;
        el.classList.add('reveal');
        if (el.dataset.reveal) el.classList.add(`reveal-${el.dataset.reveal}`);
        el.style.setProperty('--reveal-delay', `${(Math.max(column, 0) % 4) * 90}ms`);
        observer.observe(el);
      });
    };

    prepare();
    let queued = 0;
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(queued);
      queued = requestAnimationFrame(prepare);
    });
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(queued);
      timers.forEach(clearTimeout);
      mutations.disconnect();
      observer.disconnect();
      root.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
        el.classList.remove('reveal', 'is-visible', `reveal-${el.dataset.reveal}`);
        el.style.removeProperty('--reveal-delay');
      });
    };
  }, [rootRef, resetKey]);
}
