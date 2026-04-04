/* Parse DDMMYYYY string into a Date.
 * e.g. "22122016" → Dec 22 2016
 */
export function parseDate(raw: string): Date {
  const s = String(raw);
  if (!/^\d{8}$/.test(s)) return new Date(NaN);

  const day   = parseInt(s.slice(0, 2), 10);
  const month = parseInt(s.slice(2, 4), 10) - 1; // 0-indexed
  const year  = parseInt(s.slice(4, 8), 10);
  const date  = new Date(year, month, day);

  // Guard against silent overflow (e.g. Feb 30 → Mar 2)
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
    return new Date(NaN);
  }
  return date;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
