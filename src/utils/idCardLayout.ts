/** Must match backend/src/utils/idCardLayout.ts — ratios for id-card-template.jpg (683×1024). */
export const ID_CARD_LAYOUT = {
  photo: { x: 0.051, y: 0.389, w: 0.366, h: 0.349, radiusTop: 10, radiusBottom: 12 },
  name: { x: 0.449, y: 0.421, w: 0.33, h: 0.044 },
  bloodGroup: { x: 0.79, y: 0.421, w: 0.16, h: 0.034 },
  memberId: { x: 0.449, y: 0.511, w: 0.48, h: 0.034 },
  designation: { x: 0.449, y: 0.607, w: 0.50, h: 0.058 },
  expiry: { x: 0.449, y: 0.715, w: 0.50, h: 0.03 },
  qr: { x: 0.040, y: 0.760, size: 0.176 },
} as const;

export type IdCardFieldKey = keyof Omit<typeof ID_CARD_LAYOUT, 'qr'>;

function pct(n: number) {
  return `${n * 100}%`;
}

export function idCardBoxStyle(key: IdCardFieldKey) {
  const r = ID_CARD_LAYOUT[key];
  return {
    left: pct(r.x),
    top: pct(r.y),
    width: pct(r.w),
    height: pct(r.h),
  } as const;
}

export function idCardPhotoStyle(): React.CSSProperties {
  const p = ID_CARD_LAYOUT.photo;
  return {
    left: pct(p.x),
    top: pct(p.y),
    width: pct(p.w),
    height: pct(p.h),
    borderTopLeftRadius: `${p.radiusTop}px`,
    borderTopRightRadius: `${p.radiusTop}px`,
    borderBottomLeftRadius: `${p.radiusBottom}px`,
    borderBottomRightRadius: `${p.radiusBottom}px`,
  };
}

export function idCardQrStyle() {
  const q = ID_CARD_LAYOUT.qr;
  // QR is square in pixels; size is fraction of card width (683).
  // Height as % of card height = size * (683/1024) so the QR stays square.
  const heightPct = q.size * (683 / 1024);
  return {
    left: pct(q.x),
    top: pct(q.y),
    width: pct(q.size),
    height: pct(heightPct),
  } as const;
}
