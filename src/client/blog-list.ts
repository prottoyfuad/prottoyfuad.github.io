/* Open/closed state of each collapsible section,
 * keyed by element id.
 */
type SectionState = Record<string, boolean>;

const STORAGE_KEY = 'blog-sections';

function getState(): SectionState {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as SectionState;
  } catch {
    return {};
  }
}

function saveState(state: SectionState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

document.addEventListener('DOMContentLoaded', () => {
  const details = document.querySelectorAll<HTMLDetailsElement>('details[id]');
  const state   = getState();

  // Restore open/closed state from last visit
  details.forEach(el => {
    if (el.id in state) el.open = state[el.id];
  });

  // Persist on every toggle
  details.forEach(el => {
    el.addEventListener('toggle', () => {
      const current = getState();
      current[el.id] = el.open;
      saveState(current);
    });
  });
});
