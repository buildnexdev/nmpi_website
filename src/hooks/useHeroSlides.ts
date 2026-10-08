import { useEffect, useState } from 'react';
import { apiClient, asArray } from '../services/apiClient';

export type HeroSlide =
  | { type: 'image'; src: string }
  | { type: 'video'; src: string };

/** Real event photos only — not text-heavy posters from Events/News. */
export const HERO_PHOTO_ALLOWLIST = [
  '/uploads/Gallery/IMG-20260925-WA0072.jpg',
  '/uploads/Gallery/IMG-20260925-WA0073.jpg',
] as const;

const FALLBACK_SLIDES: HeroSlide[] = [
  { type: 'image', src: HERO_PHOTO_ALLOWLIST[0] },
  { type: 'image', src: HERO_PHOTO_ALLOWLIST[1] },
  { type: 'image', src: HERO_PHOTO_ALLOWLIST[0] },
];

type UploadRow = { path: string; kind?: string; folder?: string };

function buildSlides(rows: UploadRow[]): HeroSlide[] {
  const allow = new Set<string>(HERO_PHOTO_ALLOWLIST);
  const images = rows
    .filter((r) => (r.kind === 'image' || !r.kind) && allow.has(r.path))
    .map((r) => r.path);
  const uniqueImages = [...new Set(images.length ? images : [...HERO_PHOTO_ALLOWLIST])];
  const videos = rows.filter((r) => r.kind === 'video').map((r) => r.path);

  const out: HeroSlide[] = [];
  for (const src of videos.slice(0, 1)) out.push({ type: 'video', src });
  for (const src of uniqueImages) {
    if (out.length >= 3) break;
    out.push({ type: 'image', src });
  }
  while (out.length < 3 && uniqueImages.length) {
    out.push({ type: 'image', src: uniqueImages[out.length % uniqueImages.length] });
  }
  return out.length ? out.slice(0, 3) : FALLBACK_SLIDES;
}

export function useHeroSlides(): HeroSlide[] {
  const [slides, setSlides] = useState<HeroSlide[]>(FALLBACK_SLIDES);

  useEffect(() => {
    let cancelled = false;
    apiClient
      .get('/uploads/list', { params: { folder: 'Gallery,Videos' } })
      .then((res) => {
        if (cancelled) return;
        setSlides(buildSlides(asArray(res.data.data)));
      })
      .catch(() => {
        if (!cancelled) setSlides(FALLBACK_SLIDES);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return slides;
}

/** @deprecated use useHeroSlides */
export function useThreeSlides(): string[] {
  return [...HERO_PHOTO_ALLOWLIST];
}
