import React, { useCallback, useEffect, useRef, useState } from 'react';
import { mediaUrl } from '../../services/apiClient';
import { useLanguage } from '../../context/LanguageContext';
import type { HeroSlide } from '../../hooks/useHeroSlides';
import './ImageBgSlider.css';

type Variant = 'hero' | 'section' | 'fill';

type Props = {
  slides: HeroSlide[];
  variant?: Variant;
  className?: string;
  intervalMs?: number;
  children?: React.ReactNode;
};

const DEFAULT_INTERVAL = 6000;

export const ImageBgSlider: React.FC<Props> = ({
  slides,
  variant = 'section',
  className = '',
  intervalMs = DEFAULT_INTERVAL,
  children,
}) => {
  const { t } = useLanguage();
  const total = Math.min(3, slides.length);
  const safeSlides = slides.slice(0, 3);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragStart = useRef<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const go = useCallback((step: number) => {
    if (total <= 1) return;
    setActive((i) => (i + step + total) % total);
  }, [total]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const current = safeSlides[active];
    const ms = current?.type === 'video' ? Math.max(intervalMs, 12000) : intervalMs;
    const timer = window.setTimeout(() => go(1), ms);
    return () => window.clearTimeout(timer);
  }, [active, paused, go, intervalMs, total, safeSlides]);

  useEffect(() => {
    videoRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === active) {
        el.currentTime = 0;
        void el.play().catch(() => {});
      } else {
        el.pause();
      }
    });
  }, [active, safeSlides]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
  };

  return (
    <div
      className={`image-bg-slider is-${variant} ${className}`.trim()}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (dragStart.current = null)}
      role="region"
      aria-roledescription="carousel"
      aria-label={t('hero.slideAria', { number: active + 1 })}
    >
      <div className="image-bg-slider-layers" aria-hidden="true">
        {safeSlides.map((slide, i) => (
          <div key={`${slide.type}-${slide.src}`} className={`image-bg-slider-layer ${i === active ? 'is-active' : ''}`}>
            {slide.type === 'video' ? (
              <video
                ref={(el) => { videoRefs.current[i] = el; }}
                className="image-bg-slider-video"
                src={mediaUrl(slide.src)}
                muted
                playsInline
                loop
                preload="metadata"
              />
            ) : (
              <div className="image-bg-slider-photo" style={{ backgroundImage: `url("${mediaUrl(slide.src)}")` }} />
            )}
          </div>
        ))}
        <div className="image-bg-slider-shade" />
      </div>

      {children && <div className="image-bg-slider-content">{children}</div>}

      {total > 1 && (
        <>
          <button type="button" className="image-bg-slider-arrow prev" onClick={() => go(-1)} aria-label={t('hero.prevSlide')}>
            <i className="bi bi-chevron-left" aria-hidden="true"></i>
          </button>
          <button type="button" className="image-bg-slider-arrow next" onClick={() => go(1)} aria-label={t('hero.nextSlide')}>
            <i className="bi bi-chevron-right" aria-hidden="true"></i>
          </button>
          <div className="image-bg-slider-dots" role="tablist" aria-label={t('hero.slideAria', { number: active + 1 })}>
            {safeSlides.map((slide, i) => (
              <button
                key={`${slide.type}-${slide.src}-dot`}
                type="button"
                role="tab"
                className={i === active ? 'is-active' : ''}
                aria-selected={i === active}
                onClick={() => setActive(i)}
                aria-label={t('hero.slideAria', { number: i + 1 })}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
