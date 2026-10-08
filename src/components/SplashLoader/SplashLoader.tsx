import React, { useEffect, useState } from 'react';
import { translate, translateRaw } from '../../context/LanguageContext';
import { prefersReducedMotion } from '../../hooks/useInView';
import './SplashLoader.css';

const MIN_VISIBLE_MS = 2600;
const MAX_VISIBLE_MS = 6000;
const FADE_MS = 650;

/** Full-screen intro shown on the first page load: logo, spinner ring and the movement's goal lines. */
export const SplashLoader: React.FC = () => {
  const [phase, setPhase] = useState<'show' | 'hide' | 'done'>('show');
  const lines = translateRaw<string[]>('ta', 'founder.goal') ?? [];

  useEffect(() => {
    const started = performance.now();
    const minVisible = prefersReducedMotion() ? 1200 : MIN_VISIBLE_MS;
    let hideTimer = 0;
    const finish = () => {
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => setPhase('hide'), Math.max(0, minVisible - (performance.now() - started)));
    };
    const fallback = window.setTimeout(() => setPhase('hide'), MAX_VISIBLE_MS);

    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });

    return () => {
      window.removeEventListener('load', finish);
      window.clearTimeout(hideTimer);
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (phase === 'done') return;
    document.body.classList.add('splash-active');
    if (phase === 'hide') {
      const timer = window.setTimeout(() => setPhase('done'), FADE_MS);
      return () => window.clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'done') document.body.classList.remove('splash-active');
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <div className={`splash ${phase === 'hide' ? 'is-leaving' : ''}`} role="status" aria-live="polite">
      <div className="splash-glow" aria-hidden="true"></div>
      <div className="splash-logo-wrap">
        <span className="splash-ring" aria-hidden="true"></span>
        <span className="splash-ring splash-ring-2" aria-hidden="true"></span>
        <img src="/logo.jpg" alt={translate('ta', 'common.brandName')} className="splash-logo" />
      </div>
      <div className="splash-lines" lang="ta">
        {lines.map((line, i) => (
          <span key={line} className="splash-line" style={{ animationDelay: `${0.45 + i * 0.55}s` }}>
            {line}
          </span>
        ))}
      </div>
      <div className="splash-progress" aria-hidden="true"><span></span></div>
    </div>
  );
};
