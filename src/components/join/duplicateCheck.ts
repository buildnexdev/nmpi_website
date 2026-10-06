/** Fields on the join form whose values must be unique across members. */
export type DuplicateField = 'phone_number' | 'email' | 'aadhaar_number' | 'voter_id';

/** Shared duplicate-check state owned by JoinPage and consumed by the two form tabs. */
export interface DuplicateChecker {
  /** Server-confirmed "already registered" message per field. */
  errors: Partial<Record<DuplicateField, string>>;
  /** True while a server check is in flight for that field. */
  checking: Partial<Record<DuplicateField, boolean>>;
  /** Run the check for a field using the current form values; resolves true when a duplicate exists. */
  check: (field: DuplicateField, values: any) => Promise<boolean>;
  /** Drop any duplicate message for a field (called when the user edits it). */
  clear: (field: DuplicateField) => void;
}
