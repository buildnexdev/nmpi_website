import { RoleOption } from '../../services/masterDataService';

/** Shown on join/profile even when the roles API is empty or fails. */
export const JOIN_ROLE_FALLBACK: RoleOption[] = [
  { id: 1, name: 'Member', description: '' },
  { id: 2, name: 'Volunteer', description: '' },
];

export function mergeJoinRoleOptions(fromApi: RoleOption[]): RoleOption[] {
  const map = new Map<number, RoleOption>();
  for (const base of JOIN_ROLE_FALLBACK) map.set(base.id, base);
  for (const row of fromApi) {
    const id = Number(row.id);
    if (id === 1 || id === 2) map.set(id, row);
  }
  return [...map.values()].sort((a, b) => a.id - b.id);
}
