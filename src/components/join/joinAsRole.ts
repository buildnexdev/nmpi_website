/** Map free-text "join as" to membership role id (Member=1, Volunteer=2). */
export function roleIdFromJoinAsText(text: string): number {
  const raw = String(text || '').trim();
  if (!raw) return 1;
  const lower = raw.toLowerCase();
  if (/volunteer|தன்னார்வ/i.test(lower)) return 2;
  if (/member|உறுப்பினர்/i.test(lower)) return 1;
  // Any other description defaults to general member; admins can adjust later.
  return 1;
}
