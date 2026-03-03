/**
 * Get today's date in YYYY-MM-DD format using local timezone.
 */
export function getLocalDate(): string {
  return new Date().toLocaleDateString('en-CA');
}

/**
 * Format a YYYY-MM-DD date string to French locale (e.g. "lundi 3 mars").
 * Uses 'T00:00:00' suffix to avoid UTC interpretation.
 */
export function formatLocalDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}
