/** Must match backend/src/utils/idCardLayout.ts — ratios for id-card-template.jpg (~683×1024). */
export const ID_CARD_LAYOUT = {
  photo: { x: 0.042, y: 0.395, w: 0.242, h: 0.202 },
  name: { x: 0.545, y: 0.365, w: 0.42, h: 0.028 },
  memberId: { x: 0.545, y: 0.398, w: 0.42, h: 0.026 },
  phone: { x: 0.545, y: 0.431, w: 0.42, h: 0.026 },
  bloodGroup: { x: 0.545, y: 0.464, w: 0.42, h: 0.026 },
  designation: { x: 0.545, y: 0.497, w: 0.42, h: 0.032 },
  expiry: { x: 0.718, y: 0.548, w: 0.22, h: 0.026 },
  qr: { x: 0.055, y: 0.748, size: 0.198 },
} as const;

export type IdCardFieldKey = keyof Omit<typeof ID_CARD_LAYOUT, 'qr'>;

export function idCardBoxStyle(key: IdCardFieldKey) {
  const r = ID_CARD_LAYOUT[key];
  return {
    left: `${r.x * 100}%`,
    top: `${r.y * 100}%`,
    width: `${r.w * 100}%`,
    height: `${r.h * 100}%`,
  } as const;
}

export function idCardPhotoStyle() {
  const p = ID_CARD_LAYOUT.photo;
  return {
    left: `${p.x * 100}%`,
    top: `${p.y * 100}%`,
    width: `${p.w * 100}%`,
    height: `${p.h * 100}%`,
  } as const;
}

export function idCardQrStyle() {
  const q = ID_CARD_LAYOUT.qr;
  const size = q.size * 100;
  return {
    left: `${q.x * 100}%`,
    top: `${q.y * 100}%`,
    width: `${size}%`,
  } as const;
}
